// East Village Finest Deli — measurement layer (Google Analytics 4)
//
// To activate: replace the placeholder below with the real GA4 Measurement ID
// (analytics.google.com → Admin → Data streams → copy the "G-…" ID).
// Until then this file is a no-op — nothing loads, nothing is tracked.
//
// Events reported (beyond GA4's automatic page views / outbound clicks):
//   order_click      {platform, link_location, item}  — delivery-platform clicks
//   call_click       {link_location}                  — taps on the phone number
//   directions_click {link_location}                  — "Get Directions" clicks

(function () {
  var GA_MEASUREMENT_ID = "G-1NT753NHN1";

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  var PLATFORMS = ["grubhub", "seamless", "doordash", "ubereats"];

  function linkLocation(a) {
    var scope = a.closest("section, footer, header");
    if (!scope) return "page";
    return scope.id || scope.tagName.toLowerCase();
  }

  function itemName(a) {
    var card = a.closest(".signature-card");
    var h = card && card.querySelector("h3");
    return h ? h.textContent : undefined;
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.href || "";

    if (href.indexOf("tel:") === 0) {
      window.gtag("event", "call_click", { link_location: linkLocation(a) });
      return;
    }

    for (var i = 0; i < PLATFORMS.length; i++) {
      if (href.indexOf(PLATFORMS[i]) !== -1) {
        window.gtag("event", "order_click", {
          platform: PLATFORMS[i],
          link_location: linkLocation(a),
          item: itemName(a),
        });
        return;
      }
    }

    if (href.indexOf("maps.google") !== -1) {
      window.gtag("event", "directions_click", { link_location: linkLocation(a) });
    }
  });
})();
