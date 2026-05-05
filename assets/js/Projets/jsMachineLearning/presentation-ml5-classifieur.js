/**
 * MachineLearningPF — Présentation "Neural Vision"
 * Canvas réseau de neurones + animations au scroll
 */

(function () {
    'use strict';

    initFooterYear();
    initNeuralCanvas();
    initSmoothScroll();
    initBackToTop();
    initScrollReveal();
    initNavbarIsland();
    initHighlight();

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

    /**
     * Canvas : réseau de neurones animé en arrière-plan
     */
    function initNeuralCanvas() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationId = null;

        const nodes = [];
        const nodeCount = 60;
        const connectionDistance = 120;
        const colors = ['rgba(0, 255, 213, 0.6)', 'rgba(168, 85, 247, 0.5)'];

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = 2 + Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function initNodes() {
            nodes.length = 0;
            for (let i = 0; i < nodeCount; i++) {
                nodes.push(new Node());
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            nodes.forEach(n => n.update());

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < connectionDistance) {
                        const alpha = 1 - dist / connectionDistance;
                        ctx.strokeStyle = `rgba(0, 255, 213, ${alpha * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((n, i) => {
                const color = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            animationId = requestAnimationFrame(draw);
        }

        resize();
        initNodes();
        draw();

        window.addEventListener('resize', () => {
            resize();
            initNodes();
        });
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

    function initScrollReveal() {
        const steps = document.querySelectorAll('.flow-step, .tech-card, .about-point, .code-block-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        steps.forEach((el, i) => {
            el.classList.add('reveal-target');
            el.dataset.delay = i;
            observer.observe(el);
        });
    }

    function initHighlight() {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });
        }
    }

    function initNavbarIsland() {
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
})();
