// Nomik contact / demo-request receiver. Browser never holds a Supabase key —
// this function is the only writer, using the service role injected by the
// platform. Mirrors submit-waitlist: Turnstile-gated, IP rate-limited, CORS-locked.
//
// Operator setup (one-time; Supabase project + Turnstile already exist for the
// waitlist — this reuses both):
//   1. `supabase db push`                                    // applies migrations/ (adds contact_submissions)
//   2. `supabase functions deploy submit-contact --no-verify-jwt`
//      (--no-verify-jwt is required: callers are anonymous browsers, not Supabase users)
//   3. Confirm the function URL matches CONTACT_ENDPOINT in app.js
//
// TURNSTILE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY are already set
// for submit-waitlist and are shared across functions in the project.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_NAME_LEN = 200;
const MAX_COMPANY_LEN = 200;
const MIN_USE_CASE_LEN = 30;
const MAX_USE_CASE_LEN = 5000;
const TEAM_SIZES = new Set(["1", "2-10", "11-50", "50+"]);
const SOVEREIGNTY = new Set(["saas", "on-prem", "unsure"]);
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const ALLOWED_ORIGINS = new Set([
  "https://nomik.ai",
  "https://www.nomik.ai",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://www.nomik.ai";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(origin) },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token: string, ip: string | null, secret: string): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;
  const data = await res.json() as { success?: boolean };
  return data.success === true;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405, origin);
  }

  const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!turnstileSecret || !supabaseUrl || !serviceKey) {
    return jsonResponse({ ok: false, error: "server_misconfigured" }, 500, origin);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400, origin);
  }

  const name = str(payload.name).slice(0, MAX_NAME_LEN);
  const email = str(payload.email).toLowerCase();
  const company = str(payload.company).slice(0, MAX_COMPANY_LEN);
  const teamSize = str(payload.team_size);
  const useCase = str(payload.use_case).slice(0, MAX_USE_CASE_LEN);
  const sovereignty = str(payload.sovereignty);
  const turnstileToken = str(payload.turnstileToken);

  if (!name) {
    return jsonResponse({ ok: false, error: "invalid_name" }, 400, origin);
  }
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "invalid_email" }, 400, origin);
  }
  if (!company) {
    return jsonResponse({ ok: false, error: "invalid_company" }, 400, origin);
  }
  if (!TEAM_SIZES.has(teamSize)) {
    return jsonResponse({ ok: false, error: "invalid_team_size" }, 400, origin);
  }
  if (useCase.length < MIN_USE_CASE_LEN) {
    return jsonResponse({ ok: false, error: "invalid_use_case" }, 400, origin);
  }
  if (!SOVEREIGNTY.has(sovereignty)) {
    return jsonResponse({ ok: false, error: "invalid_sovereignty" }, 400, origin);
  }
  if (!turnstileToken) {
    return jsonResponse({ ok: false, error: "missing_challenge" }, 400, origin);
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 512);

  const turnstileOk = await verifyTurnstile(turnstileToken, ip, turnstileSecret);
  if (!turnstileOk) {
    return jsonResponse({ ok: false, error: "challenge_failed" }, 403, origin);
  }

  const ipHash = ip ? await sha256Hex(ip) : null;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  if (ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (countError) {
      return jsonResponse({ ok: false, error: "rate_limit_check_failed" }, 500, origin);
    }
    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return jsonResponse({ ok: false, error: "rate_limited" }, 429, origin);
    }
  }

  const { error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      name,
      email,
      company,
      team_size: teamSize,
      use_case: useCase,
      sovereignty,
      source: "nomik.ai/contact",
      ip_hash: ipHash,
      user_agent: userAgent,
    });
  if (insertError) {
    return jsonResponse({ ok: false, error: "store_failed" }, 500, origin);
  }

  return jsonResponse({ ok: true }, 200, origin);
});
