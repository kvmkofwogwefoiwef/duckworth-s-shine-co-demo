/* =========================================================
   DuckWorth's Shine Co. — Image Loader
   DO NOT EDIT.
   ========================================================= */
(function () {
  'use strict';

  function applyImages() {
    if (typeof SITE_IMAGES === 'undefined' || !SITE_IMAGES) {
      console.warn('images.js not loaded — using placeholders');
      return;
    }

    var imgEls = document.querySelectorAll('[data-img]');
    for (var i = 0; i < imgEls.length; i++) {
      var el  = imgEls[i];
      var key = el.getAttribute('data-img');
      if (!key) continue;
      var src = SITE_IMAGES[key];
      if (src) {
        el.setAttribute('src', src);
        el.removeAttribute('data-img');
      } else {
        console.warn('Image key not found in images.js: ' + key);
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
      } else {
        console.warn('Background image key not found: ' + bgKey);
      }
    }

    var phEls = document.querySelectorAll('[data-img-replace]');
    for (var k = 0; k < phEls.length; k++) {
      var phEl  = phEls[k];
      var phKey = phEl.getAttribute('data-img-replace');
      if (!phKey) continue;
      var phSrc = SITE_IMAGES[phKey];
      if (!phSrc) continue;

      var img = document.createElement('img');
      img.src    = phSrc;
      img.alt    = phEl.getAttribute('data-img-alt') || '';
      img.loading = 'lazy';

      var classes = (phEl.className || '').split(/\s+/).filter(function (c) {
        return c && c !== 'ph';
      });
      if (classes.length) img.className = classes.join(' ');

      var inlineStyle = phEl.getAttribute('style');
      if (inlineStyle) img.setAttribute('style', inlineStyle);

      var w = phEl.getAttribute('width');
      var h = phEl.getAttribute('height');
      if (w) img.setAttribute('width', w);
      if (h) img.setAttribute('height', h);

      if (phEl.parentNode) {
        phEl.parentNode.replaceChild(img, phEl);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImages);
  } else {
    applyImages();
  }
})();