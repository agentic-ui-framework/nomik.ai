# Nomik.ai translation contract (EN → FR / ES)

You are localizing the Nomik marketing site. Nomik is an AI-agent **workspace**: a
company hires a self-organizing fleet of AI agents that work alongside people, with
human approvals on consequential actions. Tone is confident, warm, precise, modern
B2B-SaaS — think Stripe / Linear / Vercel, not corporate boilerplate. Translate the
*meaning and rhythm*, never word-for-word.

## Voice
- **FR**: vouvoiement (« vous »). Professional but warm. Natural French, not anglicised
  mush — but keep accepted tech terms (cloud, agent, prompt, e-mail, token). Use
  « guillemets » for quotes. Do NOT insert narrow/non-breaking-space characters; plain
  spaces only.
- **ES**: neutral international Spanish, address the reader as « tú » in a modern,
  professional tech-brand register (like Apple/Stripe ES). No regional slang. Correct
  ¿ … ? and ¡ … !.

## Hard formatting rules (a mistake here breaks the page)
1. **Preserve every HTML tag, attribute and entity EXACTLY**, in place. Translate only
   the human-readable text around/between tags. Reposition tags as the target grammar
   needs, but never alter, drop, add, or rename a tag or attribute.
   - `Spend caps <b>per workspace</b> that pause` →
     FR `Des plafonds de dépenses <b>par espace de travail</b> qui suspendent`
   - Keep entities verbatim: `&amp;` `&nbsp;` `&rarr;` `&times;` stay as written.
   - Keep symbols verbatim: `·` `→` `✓` `—` `«` `»`.
2. **Do NOT translate**: the Nomik brand and product names (Nomik, Nomik Cloud, Nomik
   Desktop, Nomik Bridge, Nomik-1), integration/vendor names (Slack, Stripe,
   Notion, GitHub, WhatsApp, LiveKit, Deepgram, Cartesia, Ollama, …), model names (Opus,
   Sonnet, Haiku, Claude, Qwen, …), and technical tokens / acronyms / standards:
   MCP, ACP, SDK, API, REST, OAuth, JWT, RS256, AES-256-GCM, TLS, RLS, NATS, VPC, GDPR,
   RGPD-when-already-EN→use RGPD in FR/ES, EU→UE, SOC 2, ISO 27001, FSL, Apache-2.0,
   GPU, CDP. Leave code, identifiers, URLs, numbers and units (`€480`, `423`, `768`)
   unchanged.
3. Keep the meta-title suffix « · Nomik ».
4. Keep UI labels short (nav items, buttons, pills): translate tightly, don't pad.
5. No leading/trailing spaces in your output values.

## Term glossary (use these consistently)
| EN | FR | ES |
|---|---|---|
| workspace | espace de travail | espacio de trabajo |
| agent / agents | agent / agents | agente / agentes |
| AI workforce / fleet | équipe d'agents IA / flotte | equipo de agentes de IA / flota |
| Connectors (nav) · connector | Connecteurs · connecteur | Conectores · conector |
| Recipes | Recettes | Recetas |
| Skills & Prompts · skill | Compétences et prompts · compétence | Habilidades y prompts · habilidad |
| Records (the database product) | Records | Records |
| autonomy dial | molette d'autonomie | control de autonomía |
| spend cap(s) | plafond(s) de dépenses | límite(s) de gasto |
| kill switch | coupe-circuit | interruptor de emergencia |
| approval / to approve | approbation / approuver | aprobación / aprobar |
| gated / the gate | soumis à validation / la validation | sujeto a aprobación / el control |
| human-in-the-loop (HITL) | validation humaine | validación humana |
| glass-box (audit/trace) | audit transparent / traçabilité | auditoría transparente / trazabilidad |
| audit trail / decisions ledger | journal d'audit / registre des décisions | registro de auditoría / registro de decisiones |
| self-hosting / self-host | auto-hébergement / auto-héberger | autoalojamiento / autoalojar |
| on-prem | sur site | en local (on-prem) |
| open-core / open weights | open-core / poids ouverts | open-core / pesos abiertos |
| boundary (your data ~) | périmètre | perímetro |
| onboarding | prise en main | incorporación |
| early access / waitlist | accès anticipé / liste d'attente | acceso anticipado / lista de espera |
| Get early access | Obtenir un accès anticipé | Consigue acceso anticipado |
| Log in | Se connecter | Iniciar sesión |
| Talk to us | Contactez-nous | Habla con nosotros |
| Pricing | Tarifs | Precios |
| Security | Sécurité | Seguridad |
| How it works | Fonctionnement | Cómo funciona |
| Use cases | Cas d'usage | Casos de uso |
| Overview | Présentation | Resumen |
| Coming / On the roadmap / In development / Preview | Bientôt / Au programme / En cours de développement / Aperçu | Próximamente / En la hoja de ruta / En desarrollo / Vista previa |

## Output
Return a single JSON object mapping each id to `{ "fr": "…", "es": "…" }`, one entry per
input id, valid JSON, no commentary. Every id in your batch must be present.
