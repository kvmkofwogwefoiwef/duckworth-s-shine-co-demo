/* =========================================================
   DuckWorth's Shine Co. — Site Scripts
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. Mobile navigation
     --------------------------------------------------------- */
  function initNav() {
    const toggle = $('#navToggle');
    const nav    = $('#primaryNav');
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('.has-drop > a', nav).forEach((link) => {
      link.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 1000px)').matches) {
          const li = link.parentElement;
          const isOpen = li.classList.contains('is-open');
          if (!isOpen) {
            e.preventDefault();
            $$('.has-drop.is-open', nav).forEach((o) => o !== li && o.classList.remove('is-open'));
            li.classList.add('is-open');
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) close();
    });

    $$('a', nav).forEach((a) =>
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 1000px)').matches) close();
      })
    );
  }

  /* ---------------------------------------------------------
     2. Sticky header
     --------------------------------------------------------- */
  function initHeader() {
    const header = $('#siteHeader');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     3. Before / After slider
     --------------------------------------------------------- */
  function initBeforeAfter() {
    $$('[data-ba]').forEach((slider) => {
      const range = $('.ba-range', slider);
      if (!range) return;

      const setPos = (val) => {
        const v = Math.min(100, Math.max(0, Number(val)));
        slider.style.setProperty('--pos', v + '%');
      };

      range.addEventListener('input', (e) => setPos(e.target.value));

      const fromEvent = (clientX) => {
        const rect = slider.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setPos(pct);
        range.value = Math.min(100, Math.max(0, pct));
      };

      slider.addEventListener('pointerdown', (e) => {
        if (e.target === range) return;
        slider.setPointerCapture?.(e.pointerId);
        fromEvent(e.clientX);
      });
      slider.addEventListener('pointermove', (e) => {
        if (e.buttons !== 1 || e.target === range) return;
        fromEvent(e.clientX);
      });

      slider.addEventListener('keydown', (e) => {
        let val = Number(range.value);
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

  /* ---------------------------------------------------------
     4. Accordions
     --------------------------------------------------------- */
  function initAccordions() {
    $$('.accordion').forEach((acc) => {
      const items = $$('.accordion-item', acc);

      items.forEach((item) => {
        const trigger = $('.accordion-trigger', item);
        const panel   = $('.accordion-panel', item);
        if (!trigger || !panel) return;

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          items.forEach((other) => {
            if (other !== item) {
              other.classList.remove('is-open');
              $('.accordion-trigger', other)?.setAttribute('aria-expanded', 'false');
              $('.accordion-panel', other)?.style.setProperty('max-height', '0px');
            }
          });

          item.classList.toggle('is-open', !isOpen);
          trigger.setAttribute('aria-expanded', String(!isOpen));
          panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '0px';
        });
      });

      window.addEventListener('resize', () => {
        items.forEach((item) => {
          if (!item.classList.contains('is-open')) return;
          const panel = $('.accordion-panel', item);
          if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
        });
      });

      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target && target.classList.contains('accordion-item')) {
          $('.accordion-trigger', target)?.click();
        }
      }
    });
  }

  /* ---------------------------------------------------------
     5. Gallery
     --------------------------------------------------------- */
  function initGallery() {
    const grid = $('[data-gallery]');
    if (!grid) return;

    const buttons = $$('[data-filter]');
    const items   = $$('.gallery-item', grid);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        items.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });

    const lb        = $('#lightbox');
    const lbBox     = $('#lightboxMedia');
    const lbCaption = $('#lightboxCaption');
    const lbClose   = $('#lightboxClose');
    if (!lb) return;

    let lastFocused = null;

    const open = (item) => {
      lastFocused = document.activeElement;
      const media   = $('.ph', item);
      const caption = $('figcaption', item);

      lbBox.className = 'ph';
      lbBox.setAttribute('data-label', media?.dataset.label || '');
      lbCaption.textContent = caption?.textContent || '';

      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose?.focus();
    };

    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocused?.focus();
    };

    items.forEach((item) => {
      item.addEventListener('click', () => open(item));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(item);
        }
      });
    });

    lbClose?.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
    });
  }

  /* ---------------------------------------------------------
     6. Contact form — async email submission
     --------------------------------------------------------- */
  function initForms() {
    $$('form[data-form]').forEach((form) => {
      const status = $('.form-status', form);

      const showStatus = (type, msg) => {
        if (!status) return;
        status.className = 'form-status is-visible is-' + type;
        status.textContent = msg;
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        $$('.field-error', form).forEach((el) => (el.textContent = ''));
        $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));

        $$('[required]', form).forEach((field) => {
          const value = (field.value || '').trim();
          let bad = !value;

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
            const err = field.closest('.form-group')?.querySelector('.field-error')
                     || field.closest('.checkbox-row')?.parentElement?.querySelector('.field-error');
            if (err) {
              err.textContent = field.type === 'email' ? 'Enter a valid email address.'
                             : field.type === 'tel'   ? 'Enter a valid phone number.'
                             : 'This field is required.';
            }
          }
        });

        if (!valid) {
          showStatus('error', 'Please fix the highlighted fields and try again.');
          $('[aria-invalid="true"]', form)?.focus();
          return;
        }

        // Inject the quote builder summary (if present) into the form data
        const quoteSummary = document.getElementById('qbSummaryText');
        if (quoteSummary && quoteSummary.value) {
          const hidden = document.createElement('input');
          hidden.type = 'hidden';
          hidden.name = 'quote_estimate';
          hidden.value = quoteSummary.value;
          form.appendChild(hidden);
        }

        const btn = $('button[type="submit"]', form);
        const original = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        const endpoint = form.getAttribute('action');

        const finish = (ok) => {
          if (btn) { btn.disabled = false; btn.textContent = original; }
          if (ok) {
            form.reset();
            showStatus('success', 'Thanks — your request is in. We\'ll get back to you within one business day.');
          } else {
            showStatus('error', 'Something went wrong. Please call or text us directly at 517-781-1731.');
          }
        };

        if (endpoint && endpoint !== '#' && !endpoint.includes('YOUR_FORM_ID')) {
          fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form)
          })
            .then((r) => finish(r.ok))
            .catch(() => finish(false));
        } else {
          setTimeout(() => finish(true), 700);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     7. Footer year
     --------------------------------------------------------- */
  function initYear() {
    $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------------------------------------------------------
     8. Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.revealDelay || 0);
        setTimeout(() => el.classList.add('is-visible'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     9. Active nav highlighting
     --------------------------------------------------------- */
  function initActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-list a').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel') || href.startsWith('mailto')) return;
      if (href === path) a.parentElement.classList.add('is-active');
    });
  }

  /* ---------------------------------------------------------
     10. Smooth anchor scroll
     --------------------------------------------------------- */
  function initAnchorScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const header = $('#siteHeader');
      const offset = (header?.offsetHeight || 76) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  }

  /* ---------------------------------------------------------
     11. Animated stat counters
     --------------------------------------------------------- */
  function initStats() {
    const els = $$('[data-count]');
    if (!els.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = Number(el.dataset.duration) || 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = prefix + value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => {
        const target = Number(el.dataset.count);
        el.textContent =
          (el.dataset.prefix || '') +
          target.toLocaleString() +
          (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     12. SMS booking links
     --------------------------------------------------------- */
  function initSmsLinks() {
    const PHONE = '15177811731';

    $$('[data-sms]').forEach((el) => {
      const vehicle = el.dataset.smsVehicle || '';
      const message = vehicle
        ? "Hi DuckWorth's Shine Co. — I'd like to book a detail for my " + vehicle + "."
        : "Hi DuckWorth's Shine Co. — I'd like to book a detail.";
      const url = 'sms:+' + PHONE + '?&body=' + encodeURIComponent(message);
      el.setAttribute('href', url);
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeader();
    initBeforeAfter();
    initAccordions();
    initGallery();
    initForms();
    initYear();
    initReveal();
    initActiveNav();
    initAnchorScroll();
    initStats();
    initSmsLinks();
  });
})();