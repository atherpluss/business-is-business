// ============ Composants partagés + moteur i18n + animations ============

const LOGO = 'assets/logo/logo.png';
const ICON_NAV_ACCUEIL = 'assets/icons/nav-accueil.png';
const ICON_NAV_REGLES = 'assets/icons/nav-regles.png';
const ICON_NAV_TOURNOIS = 'assets/icons/nav-tournois.png';
const ICON_NAV_FAQ = 'assets/icons/nav-faq.png';

// ---------- Langue ----------
function getLang() {
  try { return localStorage.getItem('bib-lang') || 'fr'; } catch (e) { return 'fr'; }
}
function setLang(lang) {
  try { localStorage.setItem('bib-lang', lang); } catch (e) {}
  applyLang(lang);
}
function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || key;
}
function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = t(key) || '';
    if (el.classList && el.classList.contains('hero-tagline')) {
      // force hero tagline onto a single line (no breaks)
      el.textContent = val.replace(/\s+/g, ' ');
    } else if (val && val.indexOf('\n') !== -1) {
      el.innerHTML = val.replace(/\n/g, '<br/>');
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
  });
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

// ---------- SVG icônes sociales ----------
const SVG_FACEBOOK = '<svg class="social-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>';
const SVG_INSTAGRAM = '<svg class="social-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.74.07-1.08.05-1.67.23-2.06.38-.52.2-.89.44-1.28.83-.39.39-.63.76-.83 1.28-.15.39-.33.98-.38 2.06-.06 1.23-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.08.23 1.67.38 2.06.2.52.44.89.83 1.28.39.39.76.63 1.28.83.39.15.98.33 2.06.38 1.23.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.08-.05 1.67-.23 2.06-.38.52-.2.89-.44 1.28-.83.39-.39.63-.76.83-1.28.15-.39.33-.98.38-2.06.06-1.23.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.08-.23-1.67-.38-2.06a3.44 3.44 0 0 0-.83-1.28 3.44 3.44 0 0 0-1.28-.83c-.39-.15-.98-.33-2.06-.38-1.23-.06-1.59-.07-4.74-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-2.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>';
const SVG_YOUTUBE = '<svg class="social-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.2V8.8L15.6 12 10 15.2Z"/></svg>';

// ---------- Sidebar ----------
function renderSidebar() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html', key: 'nav.accueil', icon: ICON_NAV_ACCUEIL },
    { href: 'regles.html', key: 'nav.regles', icon: ICON_NAV_REGLES },
    { href: 'tournois.html', key: 'nav.tournois', icon: ICON_NAV_TOURNOIS },
    { href: 'faq.html', key: 'nav.faq', icon: ICON_NAV_FAQ },
  ];
  const items = links
    .map((l) => {
      const active = l.href === path;
      return `
      <a href="${l.href}" class="nav-link flex items-center gap-4 py-4 pb-5 border-b-[0.5px] border-black px-3 ${active ? 'text-ink' : 'text-ink/85 hover:text-ink'} transition-colors">
        <img src="${l.icon}" alt="" class="w-9 h-9 object-contain shrink-0" />
        <span data-i18n="${l.key}" class="font-display font-bold text-[17px] uppercase tracking-wide"></span>
        ${active ? '<span class="nav-indicator"></span>' : ''}
      </a>`;
    })
    .join('');

  return `
  <aside class="hidden lg:flex flex-col items-center gap-12 w-[228px] shrink-0 bg-cream min-h-screen py-10 px-5 fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
    <a href="index.html"><img src="${LOGO}" alt="Business is Business" class="w-[150px] h-auto object-contain" /></a>
    <nav class="w-full flex flex-col">${items}</nav>
    <div class="mt-auto flex flex-col items-center gap-5">
      <div class="flex rounded-full border border-ink/40 overflow-hidden text-[12px] font-display font-bold">
        <button type="button" data-lang="fr" class="lang-btn px-4 py-1.5 uppercase">FR</button>
        <button type="button" data-lang="en" class="lang-btn px-4 py-1.5 uppercase">EN</button>
      </div>
    </div>
  </aside>`;
}

// ---------- Header ----------
function renderHeader() {
  return `
  <header class="sticky top-0 z-30 flex items-center justify-between lg:justify-end h-[88px] bg-cream-header px-5 md:px-20">
    <a href="index.html" class="lg:hidden"><img src="${LOGO}" alt="Business is Business" class="h-12 w-auto object-contain" /></a>
    <div class="flex items-center gap-4">
      <div class="flex lg:hidden rounded-full border border-ink/40 overflow-hidden text-[11px] font-display font-bold">
        <button type="button" data-lang="fr" class="lang-btn px-3 py-1 uppercase">FR</button>
        <button type="button" data-lang="en" class="lang-btn px-3 py-1 uppercase">EN</button>
      </div>
      <button id="mobile-menu-toggle" aria-label="Menu" class="ml-2 lg:hidden mobile-menu-btn w-11 h-11 rounded-full border border-ink/30 bg-white hover:bg-cream transition-all duration-300 flex items-center justify-center group">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="transition-transform duration-300 group-[.active]:rotate-90"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
    <div class="hidden lg:flex items-center gap-4">
      <a href="tournois.html" data-i18n="nav.tournois" class="btn-cta ml-4 inline-flex items-center gap-3">TOURNOIS</a>
    </div>
  </header>`;
}

// ---------- Footer ----------
function renderFooter() {
  return `
  <footer class="border-t border-line/30 bg-cream-light pt-16 pb-16 px-6">
    <div class="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
      <div class="flex items-center gap-5">
        <a href="#" aria-label="Facebook" class="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center p-2.5 hover:bg-brand-blue transition-colors"><img src="assets/icons/facebook.svg" alt="Facebook" class="social-svg"/></a>
        <a href="#" aria-label="Instagram" class="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center p-2.5 hover:bg-brand-blue transition-colors"><img src="assets/icons/instagram.svg" alt="Instagram" class="social-svg"/></a>
        <a href="#" aria-label="YouTube" class="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center p-2.5 hover:bg-brand-blue transition-colors"><img src="assets/icons/youtube.svg" alt="YouTube" class="social-svg"/></a>
      </div>
      <nav class="flex flex-wrap items-center justify-center gap-8">
        <a href="faq.html" data-i18n="footer.faq" class="font-display font-bold text-[13px] tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"></a>
        <a href="regles.html" data-i18n="footer.regles" class="font-display font-bold text-[13px] tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"></a>
        <a href="tournois.html" data-i18n="footer.tournois" class="font-display font-bold text-[13px] tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"></a>
        <a href="#newsletter" data-i18n="footer.newsletter" class="font-display font-bold text-[13px] tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"></a>
      </nav>
      <div class="flex flex-col gap-3 max-w-3xl">
        <p data-i18n="footer.copyright" class="font-display font-medium text-[11px] tracking-wide uppercase text-ink-soft/50"></p>
        <p data-i18n="footer.legal" class="font-display font-medium text-[11px] tracking-wide uppercase text-ink-soft/50 leading-relaxed"></p>
        <p data-i18n="footer.rights" class="font-display font-medium text-[11px] tracking-wide uppercase text-ink-soft/50"></p>
      </div>
    </div>
  </footer>`;
}

// ---------- Marquee ----------
function renderMarquee() {
  const keys = ['marquee.1', 'marquee.2', 'marquee.3', 'marquee.4', 'marquee.5', 'marquee.6'];
  const track = keys
    .map((k) => `<span class="flex items-center gap-4 shrink-0"><span data-i18n="${k}" class="font-display text-white text-3xl md:text-4xl tracking-tight whitespace-nowrap"></span><span class="text-white text-2xl">★</span></span>`)
    .join('');
  return `
  <div class="w-full overflow-hidden bg-[#ece5cc] py-3">
    <div class="flex marquee-track w-max">
      <div class="flex items-center gap-4 pr-4 shrink-0">${track}</div>
      <div class="flex items-center gap-4 pr-4 shrink-0">${track}</div>
    </div>
  </div>`;
}

// ---------- Newsletter ----------
function renderNewsletter() {
  return `
  <section id="newsletter" class="reveal px-4 md:px-16 py-4">
    <div class="max-w-6xl mx-auto overflow-hidden rounded-[56px] shadow-[0_30px_90px_-35px_rgba(0,0,0,0.35)]">
      <div class="relative newsletter-hero" style="min-height: 220px;">
        <img class="newsletter-bg" src="assets/newsletter/newsletter-fond.png" alt="Newsletter background" />
        <div class="relative flex flex-col items-center gap-6 px-6 py-8 md:px-12 md:py-10 text-center">
          <img id="newsletter-logo-img" src="assets/newsletter/newsletter-logo.png" alt="Newsletter" class="w-[320px] md:w-[440px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]" />
          <p data-i18n="news.text" class="font-display newsletter-headline font-bold text-white text-[19px] md:text-[26px] leading-snug max-w-3xl"></p>
          <form data-newsletter-form action="https://formspree.io/f/mlgyzjga" method="POST" class="flex flex-col sm:flex-row items-center justify-center w-full max-w-3xl gap-3 rounded-full bg-white/95 p-3 shadow-[0_22px_54px_-24px_rgba(0,0,0,0.35)]">
            <input type="email" name="email" required data-i18n-placeholder="news.placeholder" class="flex-1 min-w-0 bg-transparent px-6 py-4 font-display font-bold text-[#1f2732] placeholder:text-[#8f92a0] focus:outline-none rounded-full" />
            <button type="submit" class="btn-subscribe rounded-full px-10 py-4 font-display font-black uppercase tracking-[0.2em] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)]">
              <span data-i18n="news.btn"></span>
            </button>
          </form>
          <p data-newsletter-success data-i18n="news.success" class="hidden font-display font-bold text-white text-sm"></p>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------- Rejoignez notre communauté ----------
function renderCommunity() {
  return `
  <section class="reveal border-t-2 border-cream-header px-4 md:px-16 py-14">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <div class="flex flex-col gap-4">
        <h2 data-i18n="community.title" class="font-display font-bold text-ink text-3xl leading-tight"></h2>
        <p data-i18n="community.text" class="text-ink-soft"></p>
        <div class="flex gap-4 pt-4">
          <a href="#" aria-label="Facebook" class="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center p-3 hover:bg-brand-blue hover:scale-110 transition-all"><img src="assets/icons/facebook.svg" alt="Facebook" class="social-svg"/></a>
          <a href="#" aria-label="Instagram" class="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center p-3 hover:bg-brand-blue hover:scale-110 transition-all"><img src="assets/icons/instagram.svg" alt="Instagram" class="social-svg"/></a>
          <a href="#" aria-label="YouTube" class="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center p-3 hover:bg-brand-blue hover:scale-110 transition-all"><img src="assets/icons/youtube.svg" alt="YouTube" class="social-svg"/></a>
        </div>
      </div>
      <div class="relative">
        <div class="absolute -inset-2 bg-gradient-to-r from-gold/20 to-moss/20 blur-xl rounded-3xl"></div>
        <div class="relative bg-white border-4 border-white rounded-2xl overflow-hidden shadow-2xl img-zoom-wrap">
          <img src="assets/img/communaute.jpg" alt="Communauté Business is Business" class="img-zoom w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  </section>`;
}

// ---------- Scroll reveal ----------
let __revealObserver = null;
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach((el) => el.classList.add('reveal-visible'));
    return;
  }
  __revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          __revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  observeReveal();
}
function observeReveal() {
  if (!__revealObserver) return;
  document.querySelectorAll('.reveal:not(.reveal-visible), .reveal-left:not(.reveal-visible), .reveal-right:not(.reveal-visible), .stagger:not(.reveal-visible)').forEach((el) => __revealObserver.observe(el));
}
window.__reobserveReveal = observeReveal;

// ---------- Modal ----------
function openModal(titleKey, textKey) {
  let backdrop = document.getElementById('bib-modal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'bib-modal';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <h3 data-modal-title class="font-display font-bold text-ink text-2xl md:text-3xl uppercase tracking-wide mb-5"></h3>
        <p data-modal-text class="text-ink-soft leading-relaxed mb-8"></p>
        <button type="button" data-modal-close class="btn-primary inline-flex items-center justify-center rounded-full bg-brand-blue px-8 py-2.5 text-white font-display font-bold text-sm tracking-wider uppercase shadow-[0_4px_0_#1d1f80]"></button>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.closest('[data-modal-close]')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
  backdrop.querySelector('[data-modal-title]').textContent = t(titleKey);
  backdrop.querySelector('[data-modal-text]').textContent = t(textKey);
  backdrop.querySelector('[data-modal-close]').textContent = t('etapes.close');
  requestAnimationFrame(() => backdrop.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const backdrop = document.getElementById('bib-modal');
  if (backdrop) backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
}
function openImageModal(src, altText) {
  let backdrop = document.getElementById('bib-image-modal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'bib-image-modal';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card p-0 overflow-hidden bg-transparent max-w-[950px] w-full">
        <div class="relative rounded-[32px] overflow-hidden bg-[#0f0c16] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)]">
          <button type="button" data-modal-close class="modal-close absolute right-6 top-6 z-20">×</button>
          <img src="${src}" alt="${altText}" class="w-full h-[calc(100vh-160px)] object-contain" />
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.closest('[data-modal-close]')) closeImageModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeImageModal();
    });
  } else {
    backdrop.querySelector('img').src = src;
    backdrop.querySelector('img').alt = altText;
  }
  requestAnimationFrame(() => backdrop.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}
function closeImageModal() {
  const backdrop = document.getElementById('bib-image-modal');
  if (backdrop) backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ---------- Carousel ----------
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = root.querySelectorAll('.carousel-slide');
    const dots = root.querySelectorAll('.carousel-dot');
    const texts = root.querySelectorAll('[data-carousel-text]');
    const prev = root.querySelector('.carousel-prev');
    const next = root.querySelector('.carousel-next');
    let index = 0;
    let timer = null;

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
      dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
      texts.forEach((txt, n) => txt.classList.toggle('hidden', n !== index));
    }
    function start() {
      stop();
      timer = setInterval(() => go(index + 1), 5000);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }
    dots.forEach((d, n) =>
      d.addEventListener('click', () => {
        go(n);
        start();
      })
    );
    if (prev) prev.addEventListener('click', () => {
      go(index - 1);
      start();
    });
    if (next) next.addEventListener('click', () => {
      go(index + 1);
      start();
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    go(0);
    start();
  });
}

// ---------- Init ----------
function openPlateauModal(src, alt) {
  const modal = document.getElementById('plateau-modal');
  const image = modal?.querySelector('img');
  if (!modal || !image) return;

  image.src = src;
  image.alt = alt || 'Plateau de jeu';
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePlateauModal() {
  const modal = document.getElementById('plateau-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const mount = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  };
  mount('sidebar-root', renderSidebar());
  mount('header-root', renderHeader());
  mount('footer-root', renderFooter());
  mount('marquee-root', renderMarquee());
  mount('newsletter-root', renderNewsletter());
  mount('community-root', renderCommunity());

  // Langue
  applyLang(getLang());
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });

  // Newsletter
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const success = form.parentElement.querySelector('[data-newsletter-success]');
      if (window.BibStore && emailInput && emailInput.value.trim()) {
        window.BibStore.add('bib-newsletter', { email: emailInput.value.trim() });
      }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(() => {
          if (success) success.classList.remove('hidden');
          form.reset();
        })
        .catch(() => {
          if (success) success.classList.remove('hidden');
          form.reset();
        });
    });
  });

  // Newsletter logo swap by language
  function syncNewsletterLogo() {
    const img = document.getElementById('newsletter-logo-img');
    if (!img) return;
    const lang = getLang();
    img.src = lang === 'en' ? 'assets/newsletter/newsletter-logo-en.png' : 'assets/newsletter/newsletter-logo.png';
  }
  syncNewsletterLogo();
  document.addEventListener('langchange', syncNewsletterLogo);

  // Étapes → modal
  document.querySelectorAll('[data-step-modal]').forEach((card) => {
    card.addEventListener('click', () => {
      const step = card.getAttribute('data-step-modal');
      openModal(`etapes.${step}`, `etapes.${step}.text`);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  initCarousels();
  initScrollReveal();

  // Interactive parallax on scroll for large images/backgrounds
  function initScrollParallax() {
    const raw = Array.from(document.querySelectorAll('.newsletter-hero .newsletter-bg, .img-zoom, .carousel-slide img, .img-zoom-wrap img'));
    // Exclude images that live inside the rules list to avoid scaling/cropping issues
    const targets = raw.filter((el) => !el.closest('#regles-list'));
    if (!targets.length) return;

    let ticking = false;

    function update() {
      ticking = false;
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // compute visibility factor (-1 .. 1) where 0 = center of viewport
        const centerOffset = (rect.top + rect.height / 2) - vh / 2;
        const max = vh / 1.2 + rect.height / 2;
        let factor = Math.max(-1, Math.min(1, -centerOffset / max));

        // subtle translateY and scale based on factor
        const translate = Math.round(factor * 18); // px
        const scale = 1 + Math.abs(factor) * 0.04;
        // preserve existing translateZ if any
        el.style.transform = `translateY(${translate}px) scale(${scale})`;
        el.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)';
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // initial
    requestAnimationFrame(update);
  }

  initScrollParallax();

  // Plateau preview popup
  const plateauTrigger = document.getElementById('plateau-preview-trigger');
  const plateauModal = document.getElementById('plateau-modal');
  const plateauModalClose = document.getElementById('plateau-modal-close');

  if (plateauTrigger) {
    const openPlateauPreview = () => openPlateauModal('assets/img/plateau-hd.jpg', t('plateau.imageAlt') || 'Plateau de jeu');
    plateauTrigger.addEventListener('click', openPlateauPreview);
    plateauTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPlateauPreview();
      }
    });
  }

  if (plateauModalClose) {
    plateauModalClose.addEventListener('click', closePlateauModal);
  }

  if (plateauModal) {
    plateauModal.addEventListener('click', (e) => {
      if (e.target === plateauModal) closePlateauModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && plateauModal && !plateauModal.classList.contains('hidden')) {
      closePlateauModal();
    }
  });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const mm = ensureMobileMenu();
      requestAnimationFrame(() => mm.classList.add('is-open'));
    });
  }

  // Pieces marquee: continuous loop scroll using a duplicated track and CSS animation
  (function initPiecesMarquee() {
    const root = document.getElementById('pieces-scroll');
    if (!root) return;

    let wrap = root.querySelector('.pieces-scroll-wrap');
    let track = root.querySelector('.pieces-track');

    if (!track) {
      track = document.createElement('div');
      track.className = 'pieces-track';
      while (root.firstChild) {
        const child = root.firstChild;
        if (child.classList) child.classList.add('piece-card');
        track.appendChild(child);
      }
    }

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'pieces-scroll-wrap w-full';
      if (track.parentElement === root) root.removeChild(track);
      wrap.appendChild(track);
      root.appendChild(wrap);
    }

    Array.from(track.children).forEach((c) => { if (c.classList) c.classList.add('piece-card'); });
    wrap.style.willChange = 'transform';
    wrap.style.cursor = 'grab';

    // duplicate the track contents so CSS animation can loop seamlessly
    const originalItems = Array.from(track.children);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    track.classList.add('animated');

    function setAnimationPlayback(state) {
      track.style.animationPlayState = state;
    }

    [wrap, root].forEach((el) => {
      el.addEventListener('mouseenter', () => setAnimationPlayback('paused'));
      el.addEventListener('mouseleave', () => setAnimationPlayback('running'));
      el.addEventListener('pointerenter', () => setAnimationPlayback('paused'));
      el.addEventListener('pointerleave', () => setAnimationPlayback('running'));
      el.addEventListener('focusin', () => setAnimationPlayback('paused'));
      el.addEventListener('focusout', () => setAnimationPlayback('running'));
    });

    setAnimationPlayback('running');
  })();

});

function ensureMobileMenu() {
  let mm = document.getElementById('mobile-menu-backdrop');
  if (!mm) {
    mm = document.createElement('div');
    mm.id = 'mobile-menu-backdrop';
    mm.className = 'mobile-menu-backdrop';
    mm.innerHTML = `
      <div class="mobile-menu-panel">
        <button id="mobile-menu-close" aria-label="Close" class="mobile-menu-close">×</button>
        <img src="${LOGO}" alt="Business is Business" class="mm-logo" style="--i:0" />
        <nav class="flex flex-col mt-4">
          <a href="index.html" class="mm-link" style="--i:1"><img src="${ICON_NAV_ACCUEIL}" alt="" /><span>${t('nav.accueil')}</span><span class="mm-arrow">→</span></a>
          <a href="regles.html" class="mm-link" style="--i:2"><img src="${ICON_NAV_REGLES}" alt="" /><span>${t('nav.regles')}</span><span class="mm-arrow">→</span></a>
          <a href="tournois.html" class="mm-link" style="--i:3"><img src="${ICON_NAV_TOURNOIS}" alt="" /><span>${t('nav.tournois')}</span><span class="mm-arrow">→</span></a>
          <a href="faq.html" class="mm-link" style="--i:4"><img src="${ICON_NAV_FAQ}" alt="" /><span>${t('nav.faq')}</span><span class="mm-arrow">→</span></a>
        </nav>
        <div class="mm-lang" style="--i:5">
          <button type="button" data-lang="fr" class="lang-btn">FR</button>
          <button type="button" data-lang="en" class="lang-btn">EN</button>
        </div>
        <div class="mm-social" style="--i:6">
          <a href="#" aria-label="Facebook"><img src="assets/icons/facebook.svg" alt="Facebook" /></a>
          <a href="#" aria-label="Instagram"><img src="assets/icons/instagram.svg" alt="Instagram" /></a>
          <a href="#" aria-label="YouTube"><img src="assets/icons/youtube.svg" alt="YouTube" /></a>
        </div>
      </div>`;
    document.body.appendChild(mm);
    mm.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === getLang());
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
    mm.addEventListener('click', (e) => {
      if (e.target === mm || e.target.id === 'mobile-menu-close') mm.classList.remove('is-open');
    });
  }
  return mm;
}

// ---------- Initialize Mobile Menu ----------
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!toggle) return;
  
  // Create mobile menu backdrop if it doesn't exist
  let mm = backdrop;
  if (!mm) {
    mm = document.createElement('div');
    mm.id = 'mobile-menu-backdrop';
    mm.className = 'mobile-menu-backdrop';
    mm.innerHTML = `
      <div class="mobile-menu-panel">
        <button id="mobile-menu-close" aria-label="Close" class="mobile-menu-close">×</button>
        <img src="${LOGO}" alt="Business is Business" class="mm-logo" style="--i:0" />
        <nav class="flex flex-col mt-4">
          <a href="index.html" class="mm-link" style="--i:1"><img src="${ICON_NAV_ACCUEIL}" alt="" /><span>${t('nav.accueil')}</span><span class="mm-arrow">→</span></a>
          <a href="regles.html" class="mm-link" style="--i:2"><img src="${ICON_NAV_REGLES}" alt="" /><span>${t('nav.regles')}</span><span class="mm-arrow">→</span></a>
          <a href="tournois.html" class="mm-link" style="--i:3"><img src="${ICON_NAV_TOURNOIS}" alt="" /><span>${t('nav.tournois')}</span><span class="mm-arrow">→</span></a>
          <a href="faq.html" class="mm-link" style="--i:4"><img src="${ICON_NAV_FAQ}" alt="" /><span>${t('nav.faq')}</span><span class="mm-arrow">→</span></a>
        </nav>
        <div class="mm-lang" style="--i:5">
          <button type="button" data-lang="fr" class="lang-btn">FR</button>
          <button type="button" data-lang="en" class="lang-btn">EN</button>
        </div>
        <div class="mm-social" style="--i:6">
          <a href="#" aria-label="Facebook"><img src="assets/icons/facebook.svg" alt="Facebook" /></a>
          <a href="#" aria-label="Instagram"><img src="assets/icons/instagram.svg" alt="Instagram" /></a>
          <a href="#" aria-label="YouTube"><img src="assets/icons/youtube.svg" alt="YouTube" /></a>
        </div>
      </div>`;
    document.body.appendChild(mm);
    mm.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === getLang());
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
  }
  
  // Toggle menu on button click
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mm.classList.toggle('is-open');
  });
  
  // Close menu on backdrop click or close button
  mm.addEventListener('click', (e) => {
    if (e.target === mm || e.target.id === 'mobile-menu-close' || e.target.closest('.mobile-menu-panel nav a')) {
      toggle.classList.remove('active');
      mm.classList.remove('is-open');
    }
  });
}
