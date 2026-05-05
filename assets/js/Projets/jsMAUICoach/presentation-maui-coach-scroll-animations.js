// Animations au scroll pour la page MAUICoach1 - Apple Style
(function () {
    'use strict';

    function initScrollAnimations() {
        const footerYear = document.getElementById('footer-year');
        if (footerYear) footerYear.textContent = String(new Date().getFullYear());

        const kimNav = document.getElementById('kimNavStack');
        if (kimNav) {
            const updateKimNav = () => kimNav.classList.toggle('scrolled', window.scrollY > 50);
            window.addEventListener('scroll', updateKimNav, { passive: true });
            updateKimNav();
        }

        // 1. Animations Reveal classiques (fade-up)
        const revealOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, revealOptions);

        document.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('fade-up');
            revealObserver.observe(el);
        });

        // Ajouter les styles CSS pour les animations 'reveal' s'ils n'existent pas
        if (!document.getElementById('scroll-animations-style')) {
            const style = document.createElement('style');
            style.id = 'scroll-animations-style';
            style.textContent = `
                .fade-up {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .fade-up.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Scrollytelling Apple-Style
        const steps = document.querySelectorAll('.scrolly-step');
        const visualStates = document.querySelectorAll('.visual-state');

        if (steps.length > 0 && visualStates.length > 0) {
            // L'IntersectionObserver pour déterminer l'étape active
            const scrollyOptions = {
                root: null,
                rootMargin: '-30% 0px -30% 0px', // Actif dans la bande centrale de l'écran
                threshold: 0
            };

            const scrollyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeStepName = entry.target.getAttribute('data-step');

                        // Mettre à jour les étapes texte
                        steps.forEach(step => {
                            if (step.getAttribute('data-step') === activeStepName) {
                                step.classList.add('active');
                            } else {
                                step.classList.remove('active');
                            }
                        });

                        // Mettre à jour les visuels (Sticky)
                        visualStates.forEach(visual => {
                            if (visual.getAttribute('data-visual') === activeStepName) {
                                // Si l'état change pour devenir actif
                                if (!visual.classList.contains('active')) {
                                    visual.classList.add('active');

                                    // Déclencher l'effet de typing si c'est un bloc de code
                                    if (visual.classList.contains('state-code') && window.TypingEffect) {
                                        const typingWrapper = visual.querySelector('.typing-code');
                                        if (typingWrapper) {
                                            window.TypingEffect.trigger(typingWrapper);
                                        }
                                    }
                                }
                            } else {
                                visual.classList.remove('active');
                            }
                        });
                    }
                });
            }, scrollyOptions);

            steps.forEach(step => scrollyObserver.observe(step));
        }
    }

    // Initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();
