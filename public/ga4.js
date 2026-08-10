(function () {
  'use strict';

  var measurementId = 'G-G4QC90QNXW';
  var collectorUrl = 'https://v7mhrspk.function2.insforge.app/analytics-event';
  var attributionKey = 'tayoca_attribution_v1';
  var assistKey = 'tayoca_case_study_assist_v1';
  var sessionKey = 'tayoca_analytics_session_v1';
  var sensitiveKeys = ['token', 'sale_id', 'email', 'purchase_email', 'buyer_email', 'review_token'];
  var conversionEvents = new Set(['generate_lead', 'assessment_schedule_click', 'operator_brief_signup', 'product_click']);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function clean(value, max) {
    return String(value == null ? '' : value).trim().slice(0, max || 240);
  }

  function sanitizedUrl(value) {
    try {
      var url = new URL(value || window.location.href, window.location.origin);
      sensitiveKeys.forEach(function (key) { url.searchParams.delete(key); });
      url.hash = '';
      return url.origin + url.pathname + (url.search ? url.search : '');
    } catch (error) {
      return window.location.origin + window.location.pathname;
    }
  }

  function sanitizedReferrer() {
    if (!document.referrer) return '';
    try {
      var url = new URL(document.referrer);
      return url.origin + url.pathname;
    } catch (error) {
      return '';
    }
  }

  function safeStorage(kind, key, value) {
    try {
      var store = kind === 'local' ? window.localStorage : window.sessionStorage;
      if (arguments.length === 4) {
        store.setItem(key, value);
        return value;
      }
      return store.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function sessionId() {
    var existing = safeStorage('session', sessionKey);
    if (existing) return existing;
    var created = 'tyc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    safeStorage('session', sessionKey, created);
    return created;
  }

  function currentTouch() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: clean(params.get('utm_source'), 160),
      utm_medium: clean(params.get('utm_medium'), 160),
      utm_campaign: clean(params.get('utm_campaign'), 240),
      utm_content: clean(params.get('utm_content'), 240),
      utm_term: clean(params.get('utm_term'), 240),
      referrer: sanitizedReferrer()
    };
  }

  function readJson(key) {
    try { return JSON.parse(safeStorage('session', key) || 'null'); } catch (error) { return null; }
  }

  function writeJson(key, value) {
    safeStorage('session', key, JSON.stringify(value));
    return value;
  }

  function attributionState() {
    var now = new Date().toISOString();
    var touch = currentTouch();
    var hasCampaign = Boolean(touch.utm_source || touch.utm_medium || touch.utm_campaign || touch.utm_content || touch.utm_term);
    var existing = readJson(attributionKey) || {};
    if (!existing.first_touch) {
      existing.first_touch = Object.assign({ captured_at: now, source_page: window.location.pathname }, touch);
    }
    if (hasCampaign || touch.referrer || !existing.last_touch) {
      existing.last_touch = Object.assign({ captured_at: now, source_page: window.location.pathname }, touch);
    }
    existing.newsletter = existing.newsletter || {};
    var newsletterTouch = hasCampaign && (touch.utm_source === 'operator_brief' || touch.utm_medium === 'email');
    if (newsletterTouch) {
      existing.newsletter = {
        source: touch.utm_source || 'operator_brief',
        medium: touch.utm_medium || 'email',
        issue: touch.utm_campaign,
        section: touch.utm_content,
        captured_at: now
      };
    }
    return writeJson(attributionKey, existing);
  }

  function markCaseStudyAssist() {
    if (window.location.pathname !== '/results.html') return readJson(assistKey);
    return writeJson(assistKey, {
      path: '/results.html',
      captured_at: new Date().toISOString()
    });
  }

  function compactProps(input) {
    var out = {};
    Object.keys(input || {}).forEach(function (key) {
      if (/email|token|buyer|purchase_email/i.test(key)) return;
      var value = input[key];
      if (value === undefined || value === null || value === '') return;
      if (typeof value === 'boolean' || typeof value === 'number') out[key] = value;
      else out[key] = clean(value, 500);
    });
    return out;
  }

  function contextProps(props) {
    var state = attributionState();
    var first = state.first_touch || {};
    var last = state.last_touch || {};
    var newsletter = state.newsletter || {};
    var assist = readJson(assistKey);
    var params = new URLSearchParams(window.location.search);
    return compactProps(Object.assign({}, props || {}, {
      measurement_contract: 'stage12-v1',
      source_page: window.location.pathname,
      first_touch_source: first.utm_source || first.referrer || 'direct',
      first_touch_medium: first.utm_medium || '',
      first_touch_campaign: first.utm_campaign || '',
      last_touch_source: last.utm_source || last.referrer || 'direct',
      last_touch_medium: last.utm_medium || '',
      last_touch_campaign: last.utm_campaign || '',
      newsletter_source: newsletter.source || '',
      newsletter_issue: newsletter.issue || '',
      newsletter_section: newsletter.section || '',
      case_study_assist: Boolean(assist),
      case_study_assist_path: assist ? assist.path : '',
      test_traffic: params.get('tayoca_test') === 'stage12' ? 'stage12' : ''
    }));
  }

  function sendFirstParty(name, props) {
    var payload = {
      domain: 'tayoca.com',
      name: name === 'page_view' ? 'pageview' : name,
      url: sanitizedUrl(),
      referrer: sanitizedReferrer(),
      props: Object.assign({ session_id: sessionId() }, props),
      screen_width: window.screen && window.screen.width ? window.screen.width : null,
      screen_height: window.screen && window.screen.height ? window.screen.height : null
    };
    try {
      fetch(collectorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (error) {}
    return payload;
  }

  function emit(name, props, internal) {
    var enriched = contextProps(props);
    window.gtag('event', name, enriched);
    sendFirstParty(name, enriched);

    if (!internal && conversionEvents.has(name)) {
      if (enriched.newsletter_source) {
        emit('newsletter_attributed_conversion', {
          conversion_event: name,
          newsletter_source: enriched.newsletter_source,
          newsletter_issue: enriched.newsletter_issue,
          newsletter_section: enriched.newsletter_section
        }, true);
      }
      if (enriched.case_study_assist) {
        emit('case_study_assisted_conversion', {
          conversion_event: name,
          assist_path: enriched.case_study_assist_path
        }, true);
      }
    }
    return enriched;
  }

  attributionState();
  markCaseStudyAssist();

  window.TayocaAnalytics = {
    measurementId: measurementId,
    collectorUrl: collectorUrl,
    emit: emit,
    context: contextProps,
    sanitizedLocation: sanitizedUrl
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    page_location: sanitizedUrl(),
    allow_google_signals: false,
    anonymize_ip: true
  });

  function pageReady() {
    emit('page_view', {
      page_title: document.title,
      page_location: sanitizedUrl(),
      page_path: window.location.pathname
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pageReady, { once: true });
  else pageReady();

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var destination;
    try { destination = new URL(link.href, window.location.href); } catch (error) { return; }
    var isOutbound = destination.hostname && destination.hostname !== window.location.hostname;
    var isGumroad = /(^|\.)gumroad\.com$/i.test(destination.hostname);
    if (isGumroad) {
      emit('gumroad_click', {
        link_url: destination.origin + destination.pathname,
        link_text: (link.textContent || '').trim().slice(0, 120)
      });
    } else if (isOutbound) {
      emit('outbound_click', {
        link_domain: destination.hostname,
        link_url: destination.origin + destination.pathname
      });
    }
  });
})();