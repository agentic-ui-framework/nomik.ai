/**
 * Nomik.ai Website JavaScript
 * Handles: Mobile Menu, Theme Toggle, Documentation Sidebar, Code Interactions, Sandbox
 */

(function() {
  'use strict';

  // State management
  const state = {
    theme: localStorage.getItem('nomik-theme') || 'light',
    mobileMenuOpen: false,
    activeSection: null
  };

  // DOM elements cache
  const elements = {};

  // Initialize the application
  function init() {
    cacheElements();
    initTheme();
    initMobileMenu();
    initCodeInteractions();
    initDocumentationSidebar();
    initSandbox();
    initScrollAnimations();

    // Add event listeners
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Nomik.ai website loaded successfully');
    });
  }

  // Cache DOM elements for performance
  function cacheElements() {
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle') || document.querySelector('.mobile-menu-toggle');
    elements.navMenu = document.querySelector('.nav-menu');
    elements.body = document.body;
    elements.header = document.querySelector('.header-main');
  }

  /* ================================
   * THEME MANAGEMENT
   * ================================ */
  function initTheme() {
    if (!elements.themeToggle) return;

    // Apply saved theme
    applyTheme(state.theme);

    // Theme toggle event listener
    elements.themeToggle.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(state.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    state.theme = nextTheme;
    localStorage.setItem('nomik-theme', nextTheme);
    applyTheme(nextTheme);
  }

  function applyTheme(theme) {
    elements.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    elements.body.classList.add(`theme-${theme}`);

    // Update theme toggle icons
    if (elements.themeToggle) {
      const icons = elements.themeToggle.querySelectorAll('.theme-icon');
      icons.forEach(icon => icon.style.display = 'none');

      const activeIcon = elements.themeToggle.querySelector(`.${theme}-icon`);
      if (activeIcon) activeIcon.style.display = 'block';
    }

    // Apply system preference for auto theme
    if (theme === 'auto') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      elements.body.classList.add(systemDark ? 'theme-dark' : 'theme-light');
    }
  }

  /* ================================
   * MOBILE MENU
   * ================================ */
  function initMobileMenu() {
    if (!elements.mobileMenuToggle || !elements.navMenu) return;

    elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.mobileMenuOpen &&
          !elements.mobileMenuToggle.contains(e.target) &&
          !elements.navMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && state.mobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;

    if (state.mobileMenuOpen) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  }

  function openMobileMenu() {
    elements.navMenu.classList.add('nav-menu-open');
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    elements.body.classList.add('mobile-menu-open');

    // Animate hamburger icon
    const icon = elements.mobileMenuToggle.querySelector('.mobile-menu-icon');
    if (icon) icon.classList.add('active');
  }

  function closeMobileMenu() {
    state.mobileMenuOpen = false;
    elements.navMenu.classList.remove('nav-menu-open');
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    elements.body.classList.remove('mobile-menu-open');

    // Reset hamburger icon
    const icon = elements.mobileMenuToggle.querySelector('.mobile-menu-icon');
    if (icon) icon.classList.remove('active');
  }

  /* ================================
   * CODE INTERACTIONS
   * ================================ */
  function initCodeInteractions() {
    // Copy code functionality
    document.querySelectorAll('pre[class*="language-"]').forEach(codeBlock => {
      addCopyButton(codeBlock);
    });

    // Code tab switching
    document.querySelectorAll('.code-tabs').forEach(initCodeTabs);
  }

  function addCopyButton(codeBlock) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.innerHTML = '<i class="ph ph-copy"></i>';
    copyButton.setAttribute('aria-label', 'Copy code');

    codeBlock.parentNode.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);
    wrapper.appendChild(copyButton);

    copyButton.addEventListener('click', () => {
      const code = codeBlock.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerHTML = '<i class="ph ph-check"></i>';
        copyButton.classList.add('copied');

        setTimeout(() => {
          copyButton.innerHTML = '<i class="ph ph-copy"></i>';
          copyButton.classList.remove('copied');
        }, 2000);
      });
    });
  }

  function initCodeTabs(tabContainer) {
    const tabs = tabContainer.querySelectorAll('.code-tab');
    const panels = tabContainer.querySelectorAll('.code-panel');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        if (panels[index]) panels[index].classList.add('active');
      });
    });
  }

  /* ================================
   * DOCUMENTATION SIDEBAR
   * ================================ */
  function initDocumentationSidebar() {
    const sidebar = document.querySelector('.docs-sidebar');
    if (!sidebar) return;

    // Initialize table of contents
    generateTableOfContents();

    // Search functionality
    initDocumentationSearch();

    // Section highlighting on scroll
    initSectionHighlighting();
  }

  function generateTableOfContents() {
    const tocContainer = document.querySelector('.docs-toc');
    if (!tocContainer) return;

    const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;

      const listItem = document.createElement('li');
      listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.className = 'toc-link';

      listItem.appendChild(link);
      tocList.appendChild(listItem);

      // Smooth scroll to section
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });
    });

    tocContainer.appendChild(tocList);
  }

  function initDocumentationSearch() {
    const searchInput = document.querySelector('.docs-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase();
      const searchResults = document.querySelector('.search-results');

      if (query.length < 2) {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }

      // Simple search implementation
      const sections = document.querySelectorAll('.docs-content section');
      const results = [];

      sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
          const heading = section.querySelector('h2, h3');
          if (heading) {
            results.push({
              title: heading.textContent,
              id: section.id || heading.id,
              preview: text.substring(0, 100) + '...'
            });
          }
        }
      });

      displaySearchResults(results);
    }, 300));
  }

  function displaySearchResults(results) {
    let searchResults = document.querySelector('.search-results');
    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.className = 'search-results';
      document.querySelector('.docs-search').parentNode.appendChild(searchResults);
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<p>No results found</p>';
    } else {
      searchResults.innerHTML = results.map(result => `
        <div class="search-result">
          <a href="#${result.id}">${result.title}</a>
          <p>${result.preview}</p>
        </div>
      `).join('');
    }

    searchResults.style.display = 'block';
  }

  function initSectionHighlighting() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const tocLink = document.querySelector(`.toc-link[href="#${id}"]`);

          // Remove active class from all links
          document.querySelectorAll('.toc-link').forEach(link =>
            link.classList.remove('active'));

          // Add active class to current section link
          if (tocLink) tocLink.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.docs-content h2, .docs-content h3').forEach(heading => {
      observer.observe(heading);
    });
  }

  /* ================================
   * SANDBOX FUNCTIONALITY
   * ================================ */
  function initSandbox() {
    const sandbox = document.querySelector('.sandbox-container');
    if (!sandbox) return;

    initEndpointSwitcher();
    initAPITester();
    initResponseViewer();
  }

  function initEndpointSwitcher() {
    const switcher = document.querySelector('.endpoint-switcher');
    if (!switcher) return;

    const endpoints = {
      'agent-payment': {
        url: 'https://api.nomik.ai/v1/agents/payments',
        method: 'POST',
        description: 'Initiate an agent payment',
        example: {
          agent_id: 'agt_1234567890abcdef',
          amount: 10000,
          currency: 'EUR',
          recipient: 'nomik_recipient_id',
          policy_id: 'pol_payment_rules_v1',
          metadata: {
            order_id: 'ord_abc123',
            description: 'AI model training payment'
          }
        }
      },
      'policy-check': {
        url: 'https://api.nomik.ai/v1/policies/check',
        method: 'POST',
        description: 'Check payment against policies',
        example: {
          agent_id: 'agt_1234567890abcdef',
          payment_intent: {
            amount: 5000,
            currency: 'USD',
            recipient: 'nomik_recipient_id'
          },
          policy_ids: ['pol_daily_limit', 'pol_merchant_whitelist']
        }
      },
      'agent-status': {
        url: 'https://api.nomik.ai/v1/agents/{agent_id}/status',
        method: 'GET',
        description: 'Get agent verification status',
        example: {}
      }
    };

    const buttons = switcher.querySelectorAll('.endpoint-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const endpointKey = button.dataset.endpoint;
        if (endpoints[endpointKey]) {
          updateSandboxUI(endpoints[endpointKey]);

          // Update active button
          buttons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
        }
      });
    });

    // Initialize with first endpoint
    if (buttons.length > 0) {
      buttons[0].click();
    }
  }

  function updateSandboxUI(endpoint) {
    const urlInput = document.querySelector('.api-url');
    const methodSelect = document.querySelector('.api-method');
    const requestBody = document.querySelector('.request-body');
    const description = document.querySelector('.endpoint-description');

    if (urlInput) urlInput.value = endpoint.url;
    if (methodSelect) methodSelect.value = endpoint.method;
    if (description) description.textContent = endpoint.description;
    if (requestBody) {
      requestBody.value = JSON.stringify(endpoint.example, null, 2);
    }
  }

  function initAPITester() {
    const testButton = document.querySelector('.test-api-btn');
    if (!testButton) return;

    testButton.addEventListener('click', async () => {
      const url = document.querySelector('.api-url')?.value;
      const method = document.querySelector('.api-method')?.value;
      const body = document.querySelector('.request-body')?.value;

      if (!url) return;

      testButton.disabled = true;
      testButton.textContent = 'Testing...';

      try {
        // Simulate API call (replace with real API calls when ready)
        const response = await simulateAPICall(method, url, body);
        displayAPIResponse(response);
      } catch (error) {
        displayAPIResponse({ error: error.message }, true);
      } finally {
        testButton.disabled = false;
        testButton.textContent = 'Test API';
      }
    });
  }

  async function simulateAPICall(method, url, body) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock responses based on endpoint
    if (url.includes('/payments')) {
      return {
        success: true,
        payment_id: 'pay_' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
        amount: 10000,
        currency: 'EUR',
        created_at: new Date().toISOString()
      };
    } else if (url.includes('/policies/check')) {
      return {
        approved: true,
        policy_results: [
          { policy_id: 'pol_daily_limit', status: 'passed' },
          { policy_id: 'pol_merchant_whitelist', status: 'passed' }
        ],
        risk_score: 0.2
      };
    } else if (url.includes('/status')) {
      return {
        agent_id: 'agt_1234567890abcdef',
        status: 'verified',
        verification_level: 'full',
        capabilities: ['payments', 'transfers', 'queries'],
        last_activity: new Date().toISOString()
      };
    }

    return { message: 'API response simulation' };
  }

  function displayAPIResponse(response, isError = false) {
    const responseContainer = document.querySelector('.api-response');
    if (!responseContainer) return;

    responseContainer.innerHTML = `
      <div class="response-header ${isError ? 'error' : 'success'}">
        <span class="status">${isError ? 'Error' : 'Success'}</span>
        <span class="status-code">${isError ? '400' : '200'}</span>
      </div>
      <pre><code class="language-json">${JSON.stringify(response, null, 2)}</code></pre>
    `;

    // Re-highlight syntax if Prism is available
    if (window.Prism) {
      window.Prism.highlightAllUnder(responseContainer);
    }
  }

  function initResponseViewer() {
    // Add response time simulation
    const responseContainer = document.querySelector('.api-response');
    if (responseContainer) {
      const observer = new MutationObserver(() => {
        const responseTime = Math.floor(Math.random() * 200) + 50;
        const timeElement = responseContainer.querySelector('.response-time');
        if (!timeElement) {
          const header = responseContainer.querySelector('.response-header');
          if (header) {
            const timeSpan = document.createElement('span');
            timeSpan.className = 'response-time';
            timeSpan.textContent = `${responseTime}ms`;
            header.appendChild(timeSpan);
          }
        }
      });

      observer.observe(responseContainer, { childList: true });
    }
  }

  /* ================================
   * SCROLL ANIMATIONS
   * ================================ */
  function initScrollAnimations() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Header scroll behavior
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (elements.header) {
        if (currentScrollY > 100) {
          elements.header.classList.add('scrolled');
        } else {
          elements.header.classList.remove('scrolled');
        }
      }

      lastScrollY = currentScrollY;
    });
  }

  /* ================================
   * UTILITY FUNCTIONS
   * ================================ */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.NomikApp = {
    state,
    elements,
    toggleTheme,
    toggleMobileMenu
  };

})();