/* =========================================================
   DuckWorth's Shine Co. — Site Scripts
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* 1. Mobile navigation */
  function initNav() {
    var toggle = $('#navToggle');
    var nav    = $('#primaryNav');
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('.has-drop > a', nav).forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 1000px)').matches) {
          var li = link.parentElement;
          var isOpen = li.classList.contains('is-open');
          if (!isOpen) {
            e.preventDefault();
            $$('.has-drop.is-open', nav).forEach(function (o) {
              if (o !== li) o.classList.remove('is-open');
            });
            li.classList.add('is-open');
          }
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) close();
    });

    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 1000px)').matches) close();
      });
    });
  }

  /* 2. Sticky header */
  function initHeader() {
    var header = $('#siteHeader');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 3. Before / After slider */
  function initBeforeAfter() {
    $$('[data-ba]').forEach(function (slider) {
      var range = $('.ba-range', slider);
      if (!range) return;

      var setPos = function (val) {
        var v = Math.min(100, Math.max(0, Number(val) || 0));
        slider.style.setProperty('--pos', v + '%');
      };

      range.addEventListener('input', function (e) { setPos(e.target.value); });

      var fromEvent = function (clientX) {
        var rect = slider.getBoundingClientRect();
        if (!rect.width) return;
        var pct = ((clientX - rect.left) / rect.width) * 100;
        setPos(pct);
        range.value = Math.min(100, Math.max(0, pct));
      };

      slider.addEventListener('pointerdown', function (e) {
        if (e.target === range) return;
        if (slider.setPointerCapture) slider.setPointerCapture(e.pointerId);
        fromEvent(e.clientX);
      });
      slider.addEventListener('pointermove', function (e) {
        if (e.buttons !== 1 || e.target === range) return;
        fromEvent(e.clientX);
      });

      slider.addEventListener('keydown', function (e) {
        var val = Number(range.value) || 0;
        if (e.key === 'ArrowLeft')  val -= 2;
        if (e.key === 'ArrowRight') val += 2;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          range.value = val;
          setPos(val);
        }
      });
    });
  }

  /* 4. Accordions */
  function initAccordions() {
    $$('.accordion').forEach(function (acc) {
      var items = $$('.accordion-item', acc);

      items.forEach(function (item) {
        var trigger = $('.accordion-trigger', item);
        var panel   = $('.accordion-panel', item);
        if (!trigger || !panel) return;

        trigger.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');

          items.forEach(function (other) {
            if (other === item) return;
            other.classList.remove('is-open');
            var t = $('.accordion-trigger', other);
            var p = $('.accordion-panel', other);
            if (t) t.setAttribute('aria-expanded', 'false');
            if (p) p.style.maxHeight = '0px';
          });

          item.classList.toggle('is-open', !isOpen);
          trigger.setAttribute('aria-expanded', String(!isOpen));
          panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '0px';
        });
      });

      window.addEventListener('resize', function () {
        items.forEach(function (item) {
          if (!item.classList.contains('is-open')) return;
          var panel = $('.accordion-panel', item);
          if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
        });
      });

      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target && target.classList.contains('accordion-item')) {
          var t = $('.accordion-trigger', target);
          if (t) t.click();
        }
      }
    });
  }

  /* 5. Gallery */
  function initGallery() {
    var grid = $('[data-gallery]');
    if (!grid) return;

    var buttons = $$('[data-filter]');
    var items   = $$('.gallery-item', grid);

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        items.forEach(function (item) {
          var match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });

    var lb        = $('#lightbox');
    var lbBox     = $('#lightboxMedia');
    var lbCaption = $('#lightboxCaption');
    var lbClose   = $('#lightboxClose');
    if (!lb || !lbBox || !lbCaption) return;

    var lastFocused = null;

    var open = function (item) {
      lastFocused = document.activeElement;
      var img = $('img', item);
      var media = $('.ph', item);
      var caption = $('figcaption', item);

      lbBox.innerHTML = '';
      lbBox.className = '';
      lbBox.removeAttribute('style');

      if (img && img.src) {
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt || '';
        lbBox.appendChild(clone);
      } else if (media) {
        lbBox.className = 'ph';
        lbBox.setAttribute('data-label', media.dataset.label || '');
      }
      lbCaption.textContent = caption ? caption.textContent : '';

      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    };

    var close = function () {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    items.forEach(function (item) {
      item.addEventListener('click', function () { open(item); });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(item);
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
    });
  }

  /* 6. Contact form — sends via Hostinger PHP script */
  function initForms() {
    $$('form[data-form]').forEach(function (form) {
      var status = $('.form-status', form);

      var showStatus = function (type, msg) {
        if (!status) return;
        status.className = 'form-status is-visible is-' + type;
        status.textContent = msg;
      };

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        $$('.field-error', form).forEach(function (el) { el.textContent = ''; });
        $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });

        $$('[required]', form).forEach(function (field) {
          var value = (field.value || '').trim();
          var bad = !value;

          if (!bad && field.type === 'email') {
            bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
          }
          if (!bad && field.type === 'tel') {
            bad = value.replace(/\D/g, '').length < 10;
          }
          if (!bad && field.type === 'checkbox') {
            bad = !field.checked;
          }

          if (bad) {
            valid = false;
            field.setAttribute('aria-invalid', 'true');
            var err = field.closest('.form-group') && field.closest('.form-group').querySelector('.field-error');
            if (!err && field.closest('.checkbox-row') && field.closest('.checkbox-row').parentElement) {
              err = field.closest('.checkbox-row').parentElement.querySelector('.field-error');
            }
            if (err) {
              err.textContent = field.type === 'email' ? 'Enter a valid email address.'
                              : field.type === 'tel'   ? 'Enter a valid phone number.'
                              : 'This field is required.';
            }
          }
        });

        if (!valid) {
          showStatus('error', 'Please fix the highlighted fields and try again.');
          var firstBad = $('[aria-invalid="true"]', form);
          if (firstBad) firstBad.focus();
          return;
        }

        // Add quote summary if available
        var quoteSummary = document.getElementById('qbSummaryText');
        if (quoteSummary && quoteSummary.value) {
          var hidden = document.createElement('input');
          hidden.type = 'hidden';
          hidden.name = 'quote_estimate';
          hidden.value = quoteSummary.value;
          form.appendChild(hidden);
        }

        var btn = $('button[type="submit"]', form);
        var original = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        var finish = function (ok, errorMsg) {
          if (btn) { btn.disabled = false; btn.textContent = original; }
          if (ok) {
            form.reset();
            showStatus('success', "Thanks — your request is in. We'll get back to you within one business day.");
            // Optional: redirect to thank-you page
            // window.location.href = 'thank-you.html';
          } else {
            showStatus('error', errorMsg || 'Something went wrong. Please call or text us directly at 517-781-1731.');
          }
        };

        var endpoint = form.getAttribute('action');

        // Send to PHP script on Hostinger
        if (endpoint && endpoint !== '#' && endpoint.indexOf('send-mail.php') !== -1) {
          fetch(endpoint, {
            method: 'POST',
            body: new FormData(form)
          })
            .then(function (r) {
              return r.json().catch(function () {
                // If response isn't JSON, treat as failure
                return { ok: false, error: 'Server returned invalid response.' };
              });
            })
            .then(function (data) {
              if (data && data.ok) {
                finish(true);
              } else {
                var msg = (data && data.error) ? data.error : null;
                console.error('Mail error:', msg);
                finish(false, msg);
              }
            })
            .catch(function (err) {
              console.error('Fetch error:', err);
              finish(false, 'Could not reach the server. Please check your connection and try again.');
            });
        } else {
          // Fallback for local testing before PHP is installed
          console.warn('send-mail.php not set as form action — simulating success');
          setTimeout(function () { finish(true); }, 700);
        }
      });
    });
  }

  /* 7. Footer year */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* 8. Scroll reveal */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.revealDelay || 0);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* 9. Active nav */
  function initActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-list a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.indexOf('http') === 0 || href.charAt(0) === '#' ||
          href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;
      if (href === path && a.parentElement) a.parentElement.classList.add('is-active');
    });
  }

  /* 10. Smooth anchor scroll */
  function initAnchorScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var header = $('#siteHeader');
      var offset = (header ? header.offsetHeight : 76) + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  }

  /* 11. Animated stat counters */
  function initStats() {
    var els = $$('[data-count]');
    if (!els.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var animate = function (el) {
      var target = Number(el.dataset.count) || 0;
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var duration = Number(el.dataset.duration) || 1400;
      var start = performance.now();

      var tick = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = prefix + value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        var target = Number(el.dataset.count) || 0;
        el.textContent =
          (el.dataset.prefix || '') +
          target.toLocaleString() +
          (el.dataset.suffix || '');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* 12. SMS booking links */
  function initSmsLinks() {
    var PHONE = '15177811731';

    $$('[data-sms]').forEach(function (el) {
      var vehicle = el.dataset.smsVehicle || '';
      var message = vehicle
        ? "Hi DuckWorth's Shine Co. — I'd like to book a detail for my " + vehicle + "."
        : "Hi DuckWorth's Shine Co. — I'd like to book a detail.";
      var url = 'sms:+' + PHONE + '?&body=' + encodeURIComponent(message);
      el.setAttribute('href', url);
    });
  }

  /* Boot */
  document.addEventListener('DOMContentLoaded', function () {
    try { initNav(); }          catch (e) { console.error('initNav', e); }
    try { initHeader(); }       catch (e) { console.error('initHeader', e); }
    try { initBeforeAfter(); }  catch (e) { console.error('initBeforeAfter', e); }
    try { initAccordions(); }   catch (e) { console.error('initAccordions', e); }
    try { initGallery(); }      catch (e) { console.error('initGallery', e); }
    try { initForms(); }        catch (e) { console.error('initForms', e); }
    try { initYear(); }         catch (e) { console.error('initYear', e); }
    try { initReveal(); }       catch (e) { console.error('initReveal', e); }
    try { initActiveNav(); }    catch (e) { console.error('initActiveNav', e); }
    try { initAnchorScroll(); } catch (e) { console.error('initAnchorScroll', e); }
    try { initStats(); }        catch (e) { console.error('initStats', e); }
    try { initSmsLinks(); }     catch (e) { console.error('initSmsLinks', e); }
  });
})();