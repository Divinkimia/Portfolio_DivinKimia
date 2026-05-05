// Animation 3D du smartphone Android dans le hero cosmique
(function() {
    'use strict';

    let heroPhoneFrame = null;
    let currentRotationY = -15;
    let currentRotationX = 5;
    let targetRotationY = -15;
    let targetRotationX = 5;
    let autoRotateEnabled = true;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = 0;

    function init() {
        heroPhoneFrame = document.querySelector('.android-phone-frame');
        if (!heroPhoneFrame) return;

        animateEntry();
        startAutoRotation();
        setupMouseInteraction();
        setupTouchInteraction();
        setupParallaxEffect();
    }

    function animateEntry() {
        if (!heroPhoneFrame) return;

        heroPhoneFrame.style.opacity = '0';
        heroPhoneFrame.style.transform = 'translateY(100px) rotateY(-90deg) rotateX(20deg) scale(0.5)';
        heroPhoneFrame.style.transition = 'none';

        setTimeout(() => {
            heroPhoneFrame.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            heroPhoneFrame.style.opacity = '1';
            heroPhoneFrame.style.transform = `translateY(0) rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg) scale(1)`;
            setTimeout(() => {
                heroPhoneFrame.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1), 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(138, 43, 226, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
            }, 1200);
        }, 500);
    }

    function startAutoRotation() {
        let time = 0;
        function animate() {
            if (!heroPhoneFrame || isDragging) {
                requestAnimationFrame(animate);
                return;
            }
            time += 0.01;
            if (autoRotateEnabled) {
                targetRotationY = -15 + Math.sin(time * 0.5) * 8;
                targetRotationX = 5 + Math.cos(time * 0.3) * 3;
            }
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            updateTransform();
            requestAnimationFrame(animate);
        }
        animate();
    }

    function setupMouseInteraction() {
        if (!heroPhoneFrame) return;
        heroPhoneFrame.style.cursor = 'grab';
        heroPhoneFrame.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotateEnabled = false;
            startX = e.clientX;
            startY = e.clientY;
            startRotationY = currentRotationY;
            startRotationX = currentRotationX;
            heroPhoneFrame.style.cursor = 'grabbing';
            heroPhoneFrame.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !heroPhoneFrame) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            currentRotationY = startRotationY + deltaX * 0.3;
            currentRotationX = Math.max(-20, Math.min(20, startRotationX - deltaY * 0.15));
            updateTransform();
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (heroPhoneFrame) {
                    heroPhoneFrame.style.cursor = 'grab';
                    heroPhoneFrame.style.transition = 'transform 0.3s ease-out';
                }
                setTimeout(() => { autoRotateEnabled = true; }, 2000);
            }
        });
    }

    function setupTouchInteraction() {
        if (!heroPhoneFrame) return;
        heroPhoneFrame.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            isDragging = true;
            autoRotateEnabled = false;
            startX = t.clientX;
            startY = t.clientY;
            startRotationY = currentRotationY;
            startRotationX = currentRotationX;
            heroPhoneFrame.style.transition = 'none';
        });
        heroPhoneFrame.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const t = e.touches[0];
            currentRotationY = startRotationY + (t.clientX - startX) * 0.3;
            currentRotationX = Math.max(-20, Math.min(20, startRotationX - (t.clientY - startY) * 0.15));
            updateTransform();
        });
        heroPhoneFrame.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                heroPhoneFrame.style.transition = 'transform 0.3s ease-out';
                setTimeout(() => { autoRotateEnabled = true; }, 2000);
            }
        });
    }

    function setupParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            if (isDragging || !heroPhoneFrame) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            mouseX = (e.clientX - cx) / cx * 5;
            mouseY = (e.clientY - cy) / cy * 3;
        });
    }

    function updateTransform() {
        if (!heroPhoneFrame) return;
        heroPhoneFrame.style.transform = `translateX(${mouseX}px) translateY(${mouseY}px) rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg) scale(1)`;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
