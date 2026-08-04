(function () {
  'use strict';

  var measurementId = 'G-G4QC90QNXW';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function sanitizedLocation() {
    try {
      var url = new URL(window.location.href);
      ['token', 'sale_id', 'email', 'purchase_email', 'buyer_email'].forEach(function (key) {
        url.searchParams.delete(key);
      });
      return url.origin + url.pathname + (url.search ? url.search : '') + url.hash;
    } catch (error) {
      return window.location.origin + window.location.pathname;
    }
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    page_location: sanitizedLocation()
  });
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: sanitizedLocation(),
    page_path: window.location.pathname
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var destination;
    try { destination = new URL(link.href, window.location.href); } catch (error) { return; }
    var isOutbound = destination.hostname && destination.hostname !== window.location.hostname;
    var isGumroad = /(^|\.)gumroad\.com$/i.test(destination.hostname);

    if (isGumroad) {
      window.gtag('event', 'gumroad_click', {
        link_url: destination.origin + destination.pathname,
        link_text: (link.textContent || '').trim().slice(0, 120),
        page_path: window.location.pathname
      });
    } else if (isOutbound) {
      window.gtag('event', 'outbound_click', {
        link_domain: destination.hostname,
        link_url: destination.origin + destination.pathname,
        page_path: window.location.pathname
      });
    }
  });
})();
