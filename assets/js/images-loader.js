/* =========================================================
   DuckWorth's Shine Co. — Image Loader
   Fallback loader. The main swap happens in config-loader.js
   so dynamic content also gets images.
   ========================================================= */
(function () {
  'use strict';

  function applyImages() {
    if (typeof SITE_IMAGES === 'undefined' || !SITE_IMAGES) return;

    var imgEls = document.querySelectorAll('[data-img]');
    for (var i = 0; i < imgEls.length; i++) {
      var el  = imgEls[i];
      var key = el.getAttribute('data-img');
      if (!key) continue;
      var src = SITE_IMAGES[key];
      if (src) {
        el.setAttribute('src', src);
        el.removeAttribute('data-img');
      }
    }

    var bgEls = document.querySelectorAll('[data-bg]');
    for (var j = 0; j < bgEls.length; j++) {
      var bgEl  = bgEls[j];
      var bgKey = bgEl.getAttribute('data-bg');
      if (!bgKey) continue;
      var bgSrc = SITE_IMAGES[bgKey];
      if (bgSrc) {
        bgEl.style.backgroundImage    = "url('" + bgSrc + "')";
        bgEl.style.backgroundSize     = 'cover';
        bgEl.style.backgroundPosition = 'center';
        bgEl.style.backgroundRepeat   = 'no-repeat';
        bgEl.removeAttribute('data-bg');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImages);
  } else {
    applyImages();
  }
})();