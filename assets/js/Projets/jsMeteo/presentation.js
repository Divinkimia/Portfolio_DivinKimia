// App Météo - Présentation - Scripts simplifiés

document.addEventListener('DOMContentLoaded', () => {
    safeRun(initFooterYear);
    safeRun(initSyntaxHighlighting);
    safeRun(initNavbar);
    safeRun(initSmoothScroll);
    safeRun(initBackToTop);
    safeRun(initRevealAnimations);
    safeRun(initLiveWeather);
});

function safeRun(fn) {
    try {
        fn();
    } catch (_err) {
        // Ne jamais bloquer le reste de la page si une feature casse.
    }
}

function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = String(new Date().getFullYear());
}

function initBackToTop() {
    const btn = document.querySelector('.presentation-footer .back-to-top');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
}

function initNavbar() {
    const nav = document.getElementById('kimNavStack');
    if (!nav) return;

    window.addEventListener(
        'scroll',
        () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        },
        { passive: true }
    );
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function getWeatherApiBase() {
    // Si on ouvre le fichier en file:// (clé USB / double-clic), les requêtes réseau
    // sont souvent bloquées ou non pertinentes : on affiche un fallback.
    if (location.protocol === 'file:') return null;

    // Permet de configurer une API via ?api=https://... (optionnel)
    try {
        const api = new URLSearchParams(location.search).get('api');
        if (api) return api.replace(/\/+$/, '');
    } catch (_e) {}

    // Par défaut, aucun backend requis pour le portfolio : fallback UI.
    return null;
}

function getWeatherIconClass(code) {
    if (!code) return 'fa-cloud';
    const c = parseInt(code, 10);
    if (c === 1000) return 'fa-sun';
    if (c >= 1003 && c <= 1009) return 'fa-cloud';
    if (c >= 1063 && c <= 1276) return 'fa-cloud-rain';
    if (c >= 1282) return 'fa-cloud-bolt';
    if (c >= 1135 && c <= 1147) return 'fa-fog';
    return 'fa-cloud-sun';
}

function initLiveWeather() {
    const apiBase = getWeatherApiBase();
    if (!apiBase) {
        updateWeatherFallback();
        return;
    }

    if (!('geolocation' in navigator)) {
        updateWeatherFallback();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            fetchWeather(apiBase, latitude, longitude);
        },
        () => updateWeatherFallback()
    );
}

function fetchWeather(apiBase, lat, lon) {
    Promise.all([
        fetch(`${apiBase}/weather/${lat}/${lon}`).then(r => r.json()),
        fetch(`${apiBase}/weather/forecast/${lat}/${lon}`).then(r => r.json()),
    ]).then(([current, forecast]) => {
        if (current.error) {
            updateWeatherFallback();
            return;
        }
        updateWeatherUI(current, forecast);
    }).catch(() => updateWeatherFallback());
}

function updateWeatherUI(current, forecast) {
    const loc = current.location;
    document.getElementById('weatherLocation').textContent = `${loc?.name || 'Inconnu'}, ${loc?.country || ''}`;
    document.getElementById('weatherTemp').textContent = Math.round(current.current?.temp_c ?? 0);
    document.getElementById('weatherCondition').textContent = current.current?.condition?.text || '--';

    const hum = current.current?.humidity ?? 0;
    document.getElementById('weatherHum').textContent = `Hum: ${hum}%`;

    let highLow = 'H: --° L: --°';
    if (forecast?.forecast?.forecastday?.[0]) {
        const day = forecast.forecast.forecastday[0].day;
        highLow = `H: ${Math.round(day.maxtemp_c ?? 0)}° L: ${Math.round(day.mintemp_c ?? 0)}°`;
    }
    document.getElementById('weatherHighLow').textContent = highLow;

    const iconEl = document.getElementById('weatherIcon');
    if (iconEl) {
        const iconClass = getWeatherIconClass(current.current?.condition?.code);
        iconEl.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }

    const hours = forecast?.forecast?.forecastday?.[0]?.hour;
    const forecastEl = document.getElementById('weatherForecast');
    if (forecastEl && hours && hours.length >= 4) {
        const now = new Date().getHours();
        const cards = forecastEl.querySelectorAll('.forecast-hour');
        [0, 1, 2, 3].forEach((i, idx) => {
            const hourIdx = Math.min(now + i, 23);
            const h = hours[hourIdx] || hours[i * 6];
            const time = h ? new Date(h.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--';
            const temp = h ? Math.round(h.temp_c) : '--';
            const code = h?.condition?.code;
            cards[idx].innerHTML = `<span>${time}</span><i class="fas ${getWeatherIconClass(code)}"></i><span>${temp}°</span>`;
            cards[idx].classList.toggle('active', i === 0);
        });
    }
}

function updateWeatherFallback() {
  const loc = document.getElementById('weatherLocation');
  const cond = document.getElementById('weatherCondition');
  const tempEl = document.getElementById('weatherTemp');
  const humEl = document.getElementById('weatherHum');
  const hlEl = document.getElementById('weatherHighLow');
  const iconEl = document.getElementById('weatherIcon');
  if (loc) loc.textContent = 'Paris, FR';
  if (cond) cond.textContent = 'Nuageux (demo hors ligne)';
  if (tempEl) tempEl.textContent = '15';
  if (humEl) humEl.textContent = 'Hum: 68%';
  if (hlEl) hlEl.textContent = 'H: 18° L: 11°';
  if (iconEl) {
    iconEl.innerHTML = '<i class="fas fa-cloud-sun"></i>';
  }
  const forecastEl = document.getElementById('weatherForecast');
  if (forecastEl) {
    const cards = forecastEl.querySelectorAll('.forecast-hour');
    const times = ['14:00', '15:00', '16:00', '17:00'];
    cards.forEach((c, i) => {
      c.innerHTML = `<span>${times[i]}</span><i class="fas fa-cloud"></i><span>1${i}°</span>`;
    });
  }
}

function initRevealAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-badges', { y: 20, opacity: 0, duration: 0.6, delay: 0.2 });
    gsap.from('.hero-title', { y: 30, opacity: 0, duration: 0.7, delay: 0.3 });
    gsap.from('.hero-desc', { y: 20, opacity: 0, duration: 0.6, delay: 0.5 });
    gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, delay: 0.6 });
    gsap.from('.phone-frame', { 
        x: 40, 
        opacity: 0, 
        duration: 1, 
        delay: 0.4,
        ease: 'power3.out'
    });

    gsap.utils.toArray('.section').forEach((section, i) => {
        if (i === 0) return;
        const targets = section.querySelectorAll(
            '.section-content, .section-code, .cta-inner, .interface-preview, .interface-header, .interface-showcase, ' +
            '.interface-feature-grid, .interface-pipeline, .interface-code-block, .memory-intro, .memory-split, ' +
            '.memory-cards, .cta-panel'
        );
        if (!targets.length) return;
        gsap.from(targets, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                toggleActions: 'play none none none',
            },
        });
    });
}
