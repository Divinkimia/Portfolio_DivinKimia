(function () {
    'use strict';

    const SECTIONS_META = [
        { key: 'pitch', label: 'Comment c\'est fait', icon: 'fa-rocket' },
        { key: 'probleme', label: 'Problème / Besoin', icon: 'fa-exclamation-triangle' },
        { key: 'solution', label: 'Solution apportée', icon: 'fa-lightbulb' },
        { key: 'technologies', label: 'Technologies', icon: 'fa-code' },
        { key: 'role', label: 'Mon rôle', icon: 'fa-user-tie' },
        { key: 'difficultes', label: 'Difficultés rencontrées', icon: 'fa-mountain' },
        { key: 'solutions_trouvees', label: 'Solutions trouvées', icon: 'fa-check-circle' },
        { key: 'resultat', label: 'Résultat final', icon: 'fa-trophy' },
        { key: 'ameliorations', label: 'Améliorations possibles', icon: 'fa-arrow-up' },
        { key: 'conclusion', label: 'Conclusion', icon: 'fa-microphone' }
    ];

    let state = {
        visible: false,
        fullscreen: false,
        currentSlide: 0,
        data: null
    };

    let els = {};

    function detectTheme() {
        const path = window.location.pathname;
        return path.includes('-light') ? 'light' : 'dark';
    }

    function buildDOM(container) {
        const theme = detectTheme();

        const fab = document.createElement('button');
        fab.className = 'recap-fab';
        fab.setAttribute('title', 'Mode Présentation');
        fab.setAttribute('aria-label', 'Ouvrir le récap de présentation');
        fab.innerHTML = '<i class="fas fa-chalkboard-teacher"></i>';
        document.body.appendChild(fab);

        const overlay = document.createElement('div');
        overlay.className = 'recap-overlay';
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        panel.className = 'recap-panel' + (theme === 'light' ? ' recap--light' : '');
        panel.innerHTML = `
            <div class="recap-header">
                <h2 class="recap-header-title">
                    <i class="fas fa-chalkboard-teacher"></i>
                    Récap Présentation
                </h2>
                <div class="recap-header-actions">
                    <button class="recap-btn-icon" data-action="copy" title="Copier le texte">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="recap-btn-icon" data-action="fullscreen" title="Mode plein écran">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="recap-btn-icon" data-action="close" title="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="recap-body"></div>
            <div class="recap-footer">
                <button class="recap-nav-btn" data-action="prev">
                    <i class="fas fa-arrow-left"></i> Précédent
                </button>
                <div class="recap-progress"></div>
                <button class="recap-nav-btn" data-action="next">
                    Suivant <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        const toast = document.createElement('div');
        toast.className = 'recap-toast';
        toast.textContent = 'Texte copié !';
        document.body.appendChild(toast);

        els = {
            fab,
            overlay,
            panel,
            body: panel.querySelector('.recap-body'),
            footer: panel.querySelector('.recap-footer'),
            progress: panel.querySelector('.recap-progress'),
            btnPrev: panel.querySelector('[data-action="prev"]'),
            btnNext: panel.querySelector('[data-action="next"]'),
            btnClose: panel.querySelector('[data-action="close"]'),
            btnFullscreen: panel.querySelector('[data-action="fullscreen"]'),
            btnCopy: panel.querySelector('[data-action="copy"]'),
            toast
        };
    }

    function renderSections(data) {
        let html = '';
        SECTIONS_META.forEach((meta) => {
            const value = data[meta.key];
            let contentHtml = '';

            if (Array.isArray(value)) {
                if (meta.key === 'technologies') {
                    contentHtml = '<div class="recap-tech-list">' + value.map(v => {
                        let parts = v.split(/ : | — /);
                        if (parts.length > 1) {
                            let name = parts[0];
                            let desc = parts.slice(1).join(' : ');
                            return `<div class="recap-tech-item"><div class="recap-tech-name">${name}</div><div class="recap-tech-desc">${desc}</div></div>`;
                        } else {
                            return `<div class="recap-tech-item"><div class="recap-tech-desc">${v}</div></div>`;
                        }
                    }).join('') + '</div>';
                } else {
                    contentHtml = '<ul>' + value.map(v => `<li>${v}</li>`).join('') + '</ul>';
                }
            } else {
                contentHtml = `<p>${value || ''}</p>`;
            }

            html += `
                <div class="recap-section">
                    <div class="recap-section-header">
                        <div class="recap-section-icon"><i class="fas ${meta.icon}"></i></div>
                        <h3 class="recap-section-title">${meta.label}</h3>
                    </div>
                    <div class="recap-section-content">${contentHtml}</div>
                </div>
            `;
        });
        els.body.innerHTML = html;

        let dots = '';
        SECTIONS_META.forEach((_, i) => {
            dots += `<div class="recap-progress-dot${i === 0 ? ' recap-progress-dot--active' : ''}"></div>`;
        });
        els.progress.innerHTML = dots;
    }

    function toggle(show) {
        state.visible = typeof show === 'boolean' ? show : !state.visible;
        els.panel.classList.toggle('recap--visible', state.visible);
        els.overlay.classList.toggle('recap--visible', state.visible);

        if (!state.visible) {
            exitFullscreen();
        }
    }

    function exitFullscreen() {
        state.fullscreen = false;
        state.currentSlide = 0;
        els.panel.classList.remove('recap--fullscreen');
        els.btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
        const sections = els.body.querySelectorAll('.recap-section');
        sections.forEach(s => s.classList.remove('recap-section--active'));
    }

    function enterFullscreen() {
        state.fullscreen = true;
        state.currentSlide = 0;
        els.panel.classList.add('recap--fullscreen');
        els.btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
        updateSlide();
    }

    function toggleFullscreen() {
        if (state.fullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    function updateSlide() {
        const sections = els.body.querySelectorAll('.recap-section');
        const dots = els.progress.querySelectorAll('.recap-progress-dot');

        sections.forEach((s, i) => {
            s.classList.toggle('recap-section--active', i === state.currentSlide);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('recap-progress-dot--active', i === state.currentSlide);
        });

        els.btnPrev.disabled = state.currentSlide === 0;
        els.btnNext.disabled = state.currentSlide === sections.length - 1;
    }

    function navigate(dir) {
        const total = SECTIONS_META.length;
        state.currentSlide = Math.max(0, Math.min(total - 1, state.currentSlide + dir));
        updateSlide();
    }

    function copyText() {
        if (!state.data) return;
        let text = '';
        SECTIONS_META.forEach(meta => {
            const val = state.data[meta.key];
            text += `## ${meta.label}\n`;
            if (Array.isArray(val)) {
                text += val.map(v => `- ${v}`).join('\n');
            } else {
                text += val || '';
            }
            text += '\n\n';
        });

        navigator.clipboard.writeText(text.trim()).then(() => {
            showToast();
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text.trim();
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast();
        });
    }

    function showToast() {
        els.toast.classList.add('recap--visible');
        setTimeout(() => els.toast.classList.remove('recap--visible'), 2000);
    }

    function bindEvents() {
        els.fab.addEventListener('click', () => toggle());
        els.overlay.addEventListener('click', () => toggle(false));
        els.btnClose.addEventListener('click', () => toggle(false));
        els.btnFullscreen.addEventListener('click', toggleFullscreen);
        els.btnCopy.addEventListener('click', copyText);
        els.btnPrev.addEventListener('click', () => navigate(-1));
        els.btnNext.addEventListener('click', () => navigate(1));

        document.addEventListener('keydown', (e) => {
            if (!state.visible) return;
            if (e.key === 'Escape') toggle(false);
            if (state.fullscreen) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(-1);
            }
        });
    }

    function init() {
        const container = document.getElementById('recap-presentation');
        if (!container) return;

        buildDOM(container);
        bindEvents();

        var dataScript = document.getElementById('recap-presentation-data');
        if (dataScript) {
            try {
                var data = JSON.parse(dataScript.textContent);
                state.data = data;
                renderSections(data);
                return;
            } catch (e) {
                console.warn('[RecapPresentation] Invalid inline JSON:', e.message);
            }
        }

        var src = container.getAttribute('data-recap-src');
        if (src) {
            fetch(src)
                .then(function(r) {
                    if (!r.ok) throw new Error('Recap JSON not found');
                    return r.json();
                })
                .then(function(data) {
                    state.data = data;
                    renderSections(data);
                })
                .catch(function(err) {
                    console.warn('[RecapPresentation] Could not load data:', err.message);
                });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.RecapPresentation = { init, toggle };
})();
