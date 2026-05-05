// Animations JavaScript pour la page BT Gestion Informatique - Thème EURELEC

(function() {
    'use strict';

    // ===== ANIMATION DE PARTICULES DE CODE =====
    function createCodeParticles() {
        const container = document.querySelector('.formation-page');
        if (!container) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'code-particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        container.appendChild(particlesContainer);

        const codeSymbols = ['<', '>', '{', '}', '(', ')', '[', ']', '/', '*', '=', '+', '-', ';', ':', '&', '|', '!', '?', '%', '$', '#', '@'];
        const colors = ['#2E7D32', '#388E3C', '#4CAF50', '#66BB6A'];

        function createParticle() {
            const particle = document.createElement('span');
            const symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 12 + 8;
            const startX = Math.random() * 100;
            const duration = Math.random() * 8 + 10;
            const delay = Math.random() * 5;

            particle.textContent = symbol;
            particle.style.cssText = `
                position: absolute;
                left: ${startX}%;
                bottom: -20px;
                color: ${color};
                font-size: ${size}px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: floatUp ${duration}s linear ${delay}s infinite;
                pointer-events: none;
            `;

            particlesContainer.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }

        setInterval(createParticle, 800);
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 500);
        }
    }

    function addParticleAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.3;
                }
                50% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ANIMATION DE TERMINAL QUI S'ÉCRIT =====
    function animateTerminalText() {
        const title = document.querySelector('.formation-title');
        if (!title) return;

        const originalText = title.textContent;
        let currentIndex = 0;
        let isTyping = true;

        function typeTerminal() {
            if (isTyping && currentIndex < originalText.length) {
                title.textContent = originalText.substring(0, currentIndex + 1);
                currentIndex++;
                setTimeout(typeTerminal, 80);
            } else if (currentIndex >= originalText.length) {
                title.textContent = originalText;
            }
        }

        setTimeout(() => {
            title.textContent = '';
            setTimeout(typeTerminal, 500);
        }, 1500);
    }

    // ===== ANIMATION DE RÉSEAU DE CONNEXIONS =====
    function createNetworkConnections() {
        const container = document.querySelector('.formation-main');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'network-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.1;
        `;
        container.style.position = 'relative';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const nodes = [];
        const nodeCount = 20;

        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#2E7D32';
                ctx.fill();
            });

            nodes.forEach((node, i) => {
                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(46, 125, 50, ${1 - distance / 150})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ===== ANIMATION AU SCROLL =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.info-card, .competence-badge, .mode-option').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== ANIMATION DES BADGES DE COMPÉTENCES AU SURVOL =====
    function animateCompetenceBadges() {
        const badges = document.querySelectorAll('.competence-badge');
        
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                for (let i = 0; i < 8; i++) {
                    const particle = document.createElement('div');
                    const angle = (Math.PI * 2 * i) / 8;
                    const distance = 60;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;

                    particle.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #2E7D32;
                        border-radius: 50%;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        pointer-events: none;
                        animation: badgeParticle 1s ease-out forwards;
                        --x: ${x}px;
                        --y: ${y}px;
                    `;

                    badge.style.position = 'relative';
                    badge.appendChild(particle);

                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 1000);
                }
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes badgeParticle {
                0% {
                    transform: translate(-50%, -50%) translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translate(var(--x), var(--y));
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ANIMATION DE DONNÉES QUI CIRCULENT =====
    function createDataFlow() {
        const sidebar = document.querySelector('.formation-sidebar');
        if (!sidebar) return;

        const flowContainer = document.createElement('div');
        flowContainer.className = 'data-flow-container';
        flowContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        sidebar.style.position = 'relative';
        sidebar.appendChild(flowContainer);

        function createDataPacket() {
            const packet = document.createElement('div');
            const size = Math.random() * 6 + 4;
            const startX = Math.random() * 100;
            const duration = Math.random() * 3 + 2;

            packet.style.cssText = `
                position: absolute;
                left: ${startX}%;
                top: -10px;
                width: ${size}px;
                height: ${size}px;
                background: #2E7D32;
                border-radius: 50%;
                box-shadow: 0 0 ${size * 2}px #2E7D32;
                animation: dataFlow ${duration}s linear infinite;
                opacity: ${Math.random() * 0.5 + 0.5};
            `;

            flowContainer.appendChild(packet);

            setTimeout(() => {
                if (packet.parentNode) {
                    packet.parentNode.removeChild(packet);
                }
            }, duration * 1000);
        }

        setInterval(createDataPacket, 600);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes dataFlow {
                0% {
                    transform: translateY(0);
                    opacity: 0.5;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ANIMATION DES ONGLETS AVEC EFFET DE CODE =====
    function animateTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabContent = document.querySelector(`#${this.dataset.tab}`);
                if (!tabContent) return;

                const codeOverlay = document.createElement('div');
                codeOverlay.className = 'code-overlay';
                codeOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(26, 26, 26, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    font-family: 'Courier New', monospace;
                    color: #2E7D32;
                    font-size: 18px;
                    animation: codeFlash 0.5s ease-out;
                `;
                codeOverlay.textContent = 'Loading...';
                tabContent.style.position = 'relative';
                tabContent.appendChild(codeOverlay);

                setTimeout(() => {
                    if (codeOverlay.parentNode) {
                        codeOverlay.parentNode.removeChild(codeOverlay);
                    }
                }, 500);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes codeFlash {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.1);
                }
                100% {
                    opacity: 0;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ANIMATION DES CARTES D'INFO AVEC EFFET DE DONNÉES =====
    function animateInfoCards() {
        const cards = document.querySelectorAll('.info-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const dataEffect = document.createElement('div');
                dataEffect.className = 'data-effect';
                dataEffect.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(46, 125, 50, 0.2) 0%, transparent 70%);
                    animation: dataPulse 1s ease-out;
                    pointer-events: none;
                    border-radius: inherit;
                `;
                this.style.position = 'relative';
                this.appendChild(dataEffect);

                setTimeout(() => {
                    if (dataEffect.parentNode) {
                        dataEffect.parentNode.removeChild(dataEffect);
                    }
                }, 1000);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes dataPulse {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== INITIALISATION =====
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setTimeout(() => {
            addParticleAnimation();
            createCodeParticles();
            createNetworkConnections();
            createDataFlow();
            initScrollAnimations();
            animateCompetenceBadges();
            animateTabs();
            animateInfoCards();
            
            setTimeout(animateTerminalText, 2000);
        }, 500);
    }

    init();
})();
