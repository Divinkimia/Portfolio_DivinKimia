// Smartphone virtuel interactif - Rotation 3D
(function() {
    'use strict';

    // État de rotation 3D
    let rotationY = 0;
    let rotationX = 5;
    const phone3d = document.getElementById('phone3d');

    // Initialisation
    function init() {
        setupRotationControls();
    }

    // Contrôles de rotation 3D
    function setupRotationControls() {
        const rotateLeft = document.getElementById('rotateLeft');
        const rotateRight = document.getElementById('rotateRight');
        const resetRotation = document.getElementById('resetRotation');

        rotateLeft?.addEventListener('click', () => {
            rotationY -= 15;
            updateRotation();
        });

        rotateRight?.addEventListener('click', () => {
            rotationY += 15;
            updateRotation();
        });

        resetRotation?.addEventListener('click', () => {
            rotationY = 0;
            rotationX = 5;
            updateRotation();
        });

        // Rotation avec la souris (drag)
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startRotationY = 0;
        let startRotationX = 0;

        phone3d?.addEventListener('mousedown', (e) => {
            // Ne pas activer le drag si on clique sur un élément interactif
            const target = e.target;
            if (target.tagName === 'INPUT' || 
                target.tagName === 'BUTTON' || 
                target.closest('.img-radio-item') ||
                target.closest('.img-entry-field') ||
                target.closest('.img-calculate-btn')) {
                return;
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startRotationY = rotationY;
            startRotationX = rotationX;
            phone3d.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            rotationY = startRotationY + deltaX * 0.5;
            rotationX = Math.max(-20, Math.min(20, startRotationX - deltaY * 0.1));
            updateRotation();
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (phone3d) phone3d.style.cursor = 'grab';
        });

        // Touch pour mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartRotationY = 0;
        let touchStartRotationX = 0;

        phone3d?.addEventListener('touchstart', (e) => {
            // Ne pas activer le drag si on touche un élément interactif
            const target = e.target;
            if (target.tagName === 'INPUT' || 
                target.tagName === 'BUTTON' || 
                target.closest('.img-radio-item') ||
                target.closest('.img-entry-field') ||
                target.closest('.img-calculate-btn')) {
                return;
            }
            
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartRotationY = rotationY;
            touchStartRotationX = rotationX;
        });

        phone3d?.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            rotationY = touchStartRotationY + deltaX * 0.5;
            rotationX = Math.max(-20, Math.min(20, touchStartRotationX - deltaY * 0.1));
            updateRotation();
        });
    }

    function updateRotation() {
        if (phone3d) {
            phone3d.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        }
    }

    // Initialisation au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
