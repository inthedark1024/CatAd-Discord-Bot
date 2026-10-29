(() => {
  'use strict';

  let currentLang = 'ru';
  let switching = false;
  let observer;

  function observeSections() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('section').forEach(section => section.classList.add('visible'));
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }

    document.querySelectorAll('[data-lang]:not([hidden]) section').forEach(section => {
      section.classList.add('reveal');
      observer.observe(section);
    });
  }

  function setLanguage(lang) {
    if (lang === currentLang || switching) return;
    switching = true;

    const groups = [...document.querySelectorAll('[data-lang]')];
    const incoming = groups.filter(element => element.dataset.lang === lang);
    const outgoing = groups.filter(element => element.dataset.lang !== lang);

    incoming.forEach(element => {
      element.hidden = false;
      element.classList.add('is-fading');
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      outgoing.forEach(element => element.classList.add('is-fading'));
      incoming.forEach(element => element.classList.remove('is-fading'));
    }));

    window.setTimeout(() => {
      outgoing.forEach(element => {
        element.hidden = true;
        element.classList.remove('is-fading');
      });

      currentLang = lang;
      document.documentElement.lang = lang;
      document.getElementById('ruButton').classList.toggle('active', lang === 'ru');
      document.getElementById('enButton').classList.toggle('active', lang === 'en');
      document.getElementById('ruButton').setAttribute('aria-pressed', String(lang === 'ru'));
      document.getElementById('enButton').setAttribute('aria-pressed', String(lang === 'en'));

      document.getElementById('intro').textContent = lang === 'ru'
        ? 'Официальные условия использования и политика конфиденциальности CatAd — рекламной сети для Discord-серверов.'
        : 'Official Terms of Service and Privacy Policy for CatAd, an advertising network for Discord servers.';

      document.getElementById('footer').textContent = lang === 'ru'
        ? 'CatAd · Мурлыкающая сеть Discord-сообществ 🐾'
        : 'CatAd · The purr-fect network for Discord communities 🐾';

      try {
        localStorage.setItem('catad-language', lang);
      } catch {}

      switching = false;
      observeSections();
    }, 300);
  }

  document.getElementById('ruButton')?.addEventListener('click', () => setLanguage('ru'));
  document.getElementById('enButton')?.addEventListener('click', () => setLanguage('en'));

  try {
    if (localStorage.getItem('catad-language') === 'en') {
      currentLang = 'ru';
      setLanguage('en');
    }
  } catch {}

  observeSections();
})();