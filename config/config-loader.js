/* =========================================================
   DuckWorth's Shine Co. — Config Loader
   Applies config values to the page. DO NOT EDIT.
   ========================================================= */
(function () {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function apply() {
    if (typeof SITE_INFO === 'undefined') return;

    /* Phone links */
    $$('a[href^="tel:"]').forEach(function (a) {
      a.href = 'tel:' + SITE_INFO.phoneRaw;
      if (/^[\d\-\(\)\s\.\+]+$/.test(a.textContent.trim())) {
        a.textContent = SITE_INFO.phone;
      }
    });

    /* Email links */
    $$('a[href^="mailto:"]').forEach(function (a) {
      a.href = 'mailto:' + SITE_INFO.email;
      if (a.textContent.indexOf('@') !== -1) a.textContent = SITE_INFO.email;
    });

    /* Maps embeds */
    $$('iframe[src*="google.com/maps"]').forEach(function (f) {
      f.src = SITE_INFO.mapsEmbedURL;
    });

    /* Maps links */
    $$('a[href*="google.com/maps"]').forEach(function (a) {
      a.href = SITE_INFO.mapsLinkURL;
    });

    /* SMS links */
    $$('[data-sms]').forEach(function (el) {
      var vehicle = el.dataset.smsVehicle || '';
      var msg = vehicle
        ? "Hi " + SITE_INFO.businessName + " — I'd like to book a detail for my " + vehicle + "."
        : "Hi " + SITE_INFO.businessName + " — I'd like to book a detail.";
      el.href = 'sms:+' + SITE_INFO.phoneSMS + '?&body=' + encodeURIComponent(msg);
    });

    /* Social links */
    $$('[data-social="facebook"]').forEach(function (a) { a.href = SITE_INFO.facebook; });
    $$('[data-social="instagram"]').forEach(function (a) { a.href = SITE_INFO.instagram; });

    if (typeof CONTENT === 'undefined') return;

    /* Hero */
    var e = $('[data-hero-eyebrow]'); if (e) e.textContent = CONTENT.heroEyebrow;
    var t = $('[data-hero-title]');   if (t) t.textContent = CONTENT.heroTitle;
    var s = $('[data-hero-subtitle]');if (s) s.textContent = CONTENT.heroSubtitle;

    /* Trust bar */
    var tb = $('[data-trustbar]');
    if (tb && CONTENT.trustBarItems) {
      tb.innerHTML = CONTENT.trustBarItems.map(function (item) {
        return '<div class="trust-item"><span class="dot"></span> ' + item + '</div>';
      }).join('');
    }

    /* Availability note */
    var at = $('[data-availability-title]'); if (at) at.textContent = CONTENT.availabilityTitle;
    var ab = $('[data-availability-body]');  if (ab) ab.textContent = CONTENT.availabilityBody;

    /* Stats */
    var st = $('[data-stats]');
    if (st && CONTENT.stats) {
      st.innerHTML = CONTENT.stats.map(function (x) {
        return '<div class="stat">' +
          '<div class="stat-value" data-count="' + x.value + '" data-suffix="' + (x.suffix || '') + '">0</div>' +
          '<div class="stat-label">' + x.label + '</div>' +
        '</div>';
      }).join('');
    }

    /* Owners */
    var ow = $('[data-owners]');
    if (ow && CONTENT.owners) {
      ow.innerHTML = CONTENT.owners.map(function (o) {
        return '<div class="card">' +
          '<img class="card-media" data-img="' + o.imageKey + '" alt="' + o.alt + '" src="assets/img/placeholder.jpg">' +
          '<div class="card-body"><h3>' + o.name + '</h3></div>' +
        '</div>';
      }).join('');
    }

    /* Reviews */
    var rv = $('[data-reviews]');
    if (rv && CONTENT.reviews) {
      rv.innerHTML = CONTENT.reviews.map(function (r) {
        var stars = new Array(Math.max(0, Math.min(5, r.stars || 5)) + 1).join('★');
        return '<blockquote class="review">' +
          '<div class="stars" aria-label="' + r.stars + ' out of 5 stars">' + stars + '</div>' +
          '<p>"' + r.text + '"</p>' +
          '<footer><strong>' + r.author + '</strong><span>' + r.meta + '</span></footer>' +
        '</blockquote>';
      }).join('');
    }

    /* Why Us */
    var wy = $('[data-whyus]');
    if (wy && CONTENT.whyUs) {
      wy.innerHTML = CONTENT.whyUs.map(function (w) {
        return '<div class="feature">' +
          '<div class="feature-icon" aria-hidden="true">' + w.icon + '</div>' +
          '<h3>' + w.title + '</h3><p>' + w.body + '</p>' +
        '</div>';
      }).join('');
    }

    /* Service area cities */
    var cl = $('[data-area-cities]');
    if (cl && SITE_INFO.serviceAreaCities) {
      cl.innerHTML = SITE_INFO.serviceAreaCities.map(function (c) {
        return c.url
          ? '<li><a href="' + c.url + '">' + c.name + '</a></li>'
          : '<li>' + c.name + '</li>';
      }).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();