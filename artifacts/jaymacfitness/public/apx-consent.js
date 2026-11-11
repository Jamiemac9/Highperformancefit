/* APX Digital consent kit: cookie banner + Google Analytics 4 + Microsoft Clarity.
   One file, no dependencies, works on any site (static HTML, Vite/React, Astro).

   Install: put this file in the site's public folder and add ONE tag to the page head:
     <script src="/apx-consent.js" defer
             data-ga="G-XXXXXXXXXX"        (GA4 measurement ID, or leave empty)
             data-gtm=""                   (Google Tag Manager container ID GTM-XXXX, or leave empty)
             data-clarity=""               (Clarity project ID, or leave empty)
             data-privacy="/privacy"       (privacy page; leave empty if the site has none)
             data-accent="#111111"></script>

   Rules it follows (see claude/standards-analytics-rollout.md in the APX Project):
   - Nothing third-party loads until the visitor accepts analytics.
   - Clarity gets the Consent API v2 signal, so UK visitors get proper sessions.
   - Reject or withdraw clears _ga*, _clck and _clsk.
   - Tag Manager loads only after consent too, with Consent Mode v2 defaults set to denied first.
   - If every ID is empty the script does nothing at all: no banner, no requests.
   - Any element with data-cookie-settings reopens the banner.
   - window.apxTrack(name, params) sends a GA4 event only after consent. */
(function () {
  'use strict';
  var me = document.currentScript || document.querySelector('script[src*="apx-consent"]');
  function attr(n, d) { var v = me && me.getAttribute(n); return v == null ? d : v.trim(); }
  var GA_ID = attr('data-ga', '');
  var CLARITY_ID = attr('data-clarity', '');
  var GTM_ID = attr('data-gtm', '');
  var PRIVACY = attr('data-privacy', '');
  var ACCENT = attr('data-accent', '#111111');
  /* The storage key includes which tools are switched on, so adding Clarity later asks everyone again:
     a yes to Google Analytics is not a yes to session recording. */
  var KEY = 'apx-consent-v1' + (CLARITY_ID ? '-c' : '');
  var MAX_AGE = 1000 * 60 * 60 * 24 * 365;

  window.apxTrack = function () {};
  if (!GA_ID && !CLARITY_ID && !GTM_ID) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }
  function write(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }

  var gaLoaded = false, clarityLoaded = false;
  function loadGA() {
    if (!GA_ID || gaLoaded) return; gaLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  var gtmLoaded = false;
  function loadGTM() {
    if (!GTM_ID || gtmLoaded) return; gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }
  function loadClarity() {
    if (!CLARITY_ID || clarityLoaded) return; clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }
  function clarityConsent(c) {
    if (!clarityLoaded || !window.clarity) return;
    window.clarity('consentv2', {
      ad_Storage: c.marketing ? 'granted' : 'denied',
      analytics_Storage: c.analytics ? 'granted' : 'denied'
    });
  }
  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (p) {
      var n = p.split('=')[0].trim();
      if (/^(_ga|_clck|_clsk)/.test(n)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = n + '=; Max-Age=0; path=/' + d;
        });
      }
    });
  }

  var current = read();
  function apply(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.analytics) { loadGA(); loadGTM(); loadClarity(); } else { clearAnalyticsCookies(); }
    clarityConsent(c);
  }
  function save(analytics, marketing) {
    current = { analytics: !!analytics, marketing: !!marketing, ts: Date.now() };
    write(current); apply(current); close();
  }
  if (current) apply(current);

  window.apxTrack = function (name, params) {
    if (current && current.analytics && (GA_ID || GTM_ID)) gtag('event', name, params || {});
  };

  /* ---------- banner ---------- */
  var tools = [(GA_ID || GTM_ID) ? 'Google Analytics' : '', CLARITY_ID ? 'Microsoft Clarity, which records clicks and scrolling (anything typed into a form is hidden)' : '']
    .filter(Boolean).join(', and ');
  var css =
    '.apxcc{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:640px;margin-inline:auto;background:#fff;color:#1a1a1a;border:1px solid #d9d9d9;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.18);padding:20px 22px;font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:left}' +
    '.apxcc h2{margin:0 0 6px;font-size:1.05rem;font-weight:700;line-height:1.3;color:#1a1a1a}' +
    '.apxcc p{margin:0;font-size:.9rem;color:#444}.apxcc a{color:' + ACCENT + ';text-decoration:underline}' +
    '.apxcc-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;justify-content:flex-end}' +
    '.apxcc button{font:inherit;font-size:.88rem;font-weight:600;line-height:1;min-height:44px;padding:0 16px;border-radius:6px;cursor:pointer;border:1px solid #bdbdbd;background:#fff;color:#1a1a1a}' +
    '.apxcc button.apxcc-yes{background:' + ACCENT + ';border-color:' + ACCENT + ';color:#fff}' +
    '.apxcc button:focus-visible,.apxcc input:focus-visible{outline:2px solid ' + ACCENT + ';outline-offset:2px}' +
    '.apxcc-prefs{margin-top:12px;border:1px solid #e3e3e3;border-radius:8px}' +
    '.apxcc-pref{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:10px 12px;border-top:1px solid #eee}.apxcc-pref:first-child{border-top:0}' +
    '.apxcc-pref b{display:block;font-size:.88rem}.apxcc-pref span{font-size:.8rem;color:#555}' +
    '.apxcc-pref input{width:20px;height:20px;flex:none;accent-color:' + ACCENT + '}' +
    '@media (max-width:520px){.apxcc-row button{flex:1 1 100%}}';

  var root = null;
  function open(showPrefs) {
    close();
    if (!document.getElementById('apxcc-css')) {
      var st = document.createElement('style'); st.id = 'apxcc-css'; st.textContent = css; document.head.appendChild(st);
    }
    root = document.createElement('div');
    root.className = 'apxcc'; root.setAttribute('role', 'dialog');
    root.setAttribute('aria-labelledby', 'apxcc-t'); root.setAttribute('aria-live', 'polite');
    root.innerHTML =
      '<h2 id="apxcc-t">Cookies on this site</h2>' +
      '<p>We would like to use analytics cookies to see how the site is used so we can improve it. They are only set if you accept. ' +
      (PRIVACY ? '<a href="' + PRIVACY + '">Privacy policy</a>' : '') + '</p>' +
      '<div class="apxcc-prefs" hidden>' +
        '<div class="apxcc-pref"><div><b>Essential</b><span>Needed for the site to work, including remembering this choice.</span></div><span>Always on</span></div>' +
        '<label class="apxcc-pref" for="apxcc-a"><div><b>Analytics</b><span>' + tools + '.</span></div><input type="checkbox" id="apxcc-a"></label>' +
      '</div>' +
      '<div class="apxcc-row">' +
        '<button type="button" data-cc="manage">Manage</button>' +
        '<button type="button" data-cc="reject">Reject</button>' +
        '<button type="button" class="apxcc-yes" data-cc="accept">Accept</button>' +
      '</div>';
    document.body.appendChild(root);
    var prefs = root.querySelector('.apxcc-prefs');
    var manage = root.querySelector('[data-cc="manage"]');
    root.querySelector('#apxcc-a').checked = !!(current && current.analytics);
    function showManage() { prefs.hidden = false; manage.textContent = 'Save choices'; manage.setAttribute('data-cc', 'save'); }
    if (showPrefs) showManage();
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-cc');
      if (a === 'accept') save(true, false);
      else if (a === 'reject') save(false, false);
      else if (a === 'manage') showManage();
      else if (a === 'save') save(root.querySelector('#apxcc-a').checked, false);
    });
  }
  function close() { if (root) { root.remove(); root = null; } }
  window.apxConsent = { open: function () { open(true); } };

  function boot() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); open(true); }
    });
    if (!current) open(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
