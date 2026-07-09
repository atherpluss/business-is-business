// ============ Peaufinage UX — interactions supplémentaires ============
// Barre de progression, compteurs animés, boutons magnétiques, tilt 3D.
// Aucun changement de structure : tout se greffe sur l'existant.

(function () {
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Barre de progression de lecture ----------
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    let ticking = false;
    function update() {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---------- Compteurs animés (section chiffres clés) ----------
  function formatNumber(n) {
    const lang = (typeof getLang === 'function' ? getLang() : 'fr');
    try { return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR').format(n); }
    catch (e) { return String(n); }
  }
  function renderCounterFinal(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    const suffix = el.getAttribute('data-counter-suffix') || '';
    el.textContent = formatNumber(target) + suffix;
  }
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    if (REDUCE || !('IntersectionObserver' in window)) {
      counters.forEach(renderCounterFinal);
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => obs.observe(el));
    }
    // Re-formater au changement de langue (séparateurs différents FR/EN)
    document.addEventListener('langchange', () => counters.forEach(renderCounterFinal));
  }

  // ---------- Boutons magnétiques ----------
  function initMagnetic() {
    const strength = 6; // px max
    document.querySelectorAll('.btn-primary, .btn-cta, .btn-subscribe').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        btn.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength - 1) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ---------- Tilt 3D subtil sur les cartes ----------
  function initTilt() {
    const maxDeg = 5;
    document.querySelectorAll('.card-lift, .step-card, .stat-card').forEach((card) => {
      if (card.dataset.tiltInit) return;
      card.dataset.tiltInit = '1';
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const lift = card.classList.contains('card-lift') ? ' translateY(-8px)' : '';
        card.style.transform =
          'perspective(800px) rotateX(' + (-y * maxDeg) + 'deg) rotateY(' + (x * maxDeg) + 'deg)' + lift;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ---------- Stockage local des inscriptions (newsletter + tournois) ----------
  window.BibStore = {
    read(key) {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
    },
    add(key, entry) {
      const list = this.read(key);
      entry.date = new Date().toISOString();
      entry.lang = (typeof getLang === 'function' ? getLang() : 'fr');
      list.push(entry);
      try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
      return list.length;
    },
    remove(key, index) {
      const list = this.read(key);
      list.splice(index, 1);
      try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
    },
    clear(key) {
      try { localStorage.setItem(key, '[]'); } catch (e) {}
    },
  };

  // ---------- Image interactive (spotlight + pan qui suivent le curseur) ----------
  function initInteractiveImages() {
    document.querySelectorAll('[data-interactive-img]').forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (!img) return;
      const spot = document.createElement('div');
      spot.className = 'img-spotlight';
      wrap.appendChild(spot);
      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        img.style.transform = 'scale(1.08) translate(' + ((0.5 - x) * 3) + '%,' + ((0.5 - y) * 3) + '%)';
        spot.style.setProperty('--sx', (x * 100) + '%');
        spot.style.setProperty('--sy', (y * 100) + '%');
        spot.style.opacity = '1';
      });
      wrap.addEventListener('mouseleave', () => {
        img.style.transform = '';
        spot.style.opacity = '0';
      });
    });
  }

  // ---------- Effet ripple au clic sur les boutons principaux ----------
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-subscribe, .btn-cta, .carousel-nav, .board-arrow, .board-spot');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-fx';
      const size = Math.max(r.width, r.height) * 1.4;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      const prevPos = getComputedStyle(btn).position;
      if (prevPos === 'static') btn.style.position = 'relative';
      btn.style.overflow = btn.style.overflow || 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // ---------- Bouton "Rejoignez-nous" : cycle Facebook -> Instagram -> YouTube ----------
  function initJoinSocialCycle() {
    const btn = document.getElementById('join-social-btn');
    const icon = document.getElementById('join-social-icon');
    const label = document.getElementById('join-social-label');
    if (!btn || !icon || !label) return;

    const networks = [
      {
        key: 'fb',
        labelKey: 'join.fb.label',
        className: 'join-social-fb',
        path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
      },
      {
        key: 'ig',
        labelKey: 'join.ig.label',
        className: 'join-social-ig',
        path: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44.54C6.08.29 6.81.12 7.87.07 8.94.02 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0Z',
      },
      {
        key: 'yt',
        labelKey: 'join.yt.label',
        className: 'join-social-yt',
        path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z',
      },
    ];
    let i = 0;
    function apply(n) {
      btn.classList.remove('join-social-fb', 'join-social-ig', 'join-social-yt');
      btn.classList.add(n.className);
      label.setAttribute('data-i18n', 'join.fb');
      label.textContent = (typeof t === 'function') ? t('join.fb') : '';
      icon.innerHTML = '<path d="' + n.path + '"></path>';
    }
    apply(networks[0]);
    document.addEventListener('langchange', () => apply(networks[i]));
    setInterval(() => {
      btn.classList.add('join-social-fading');
      setTimeout(() => {
        i = (i + 1) % networks.length;
        apply(networks[i]);
        btn.classList.remove('join-social-fading');
      }, 260);
    }, 3400);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCounters();
    initJoinSocialCycle();
    if (!REDUCE) initInteractiveImages();
    if (!REDUCE) {
      initMagnetic();
      initTilt();
      initRipple();
      // Les cartes de la page Règles sont reconstruites au changement de langue
      document.addEventListener('langchange', () => setTimeout(initTilt, 50));
    }
  });
})();
