/**
 * Puissance 4 — Présentation "Arena 4D"
 * - Hero 3D : plateau Puissance 4 interactif (Three.js)
 * - 4D viewer : évolution temporelle d'une partie
 * - Canvas fond : jetons flottants
 * - Scroll reveal + navbar scrolled + highlight.js
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initFooterYear();
        initBackToTop();
        initTokensCanvas();
        initSmoothScroll();
        initScrollReveal();
        initNavbarIsland();
        initHighlight();
        initHeroScene3D();
        initFourDViewer();
    });

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

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
        const targets = document.querySelectorAll(
            '.flow-step, .tech-card, .about-point, .code-block-item, .version-card'
        );
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
        );

        targets.forEach((el, i) => {
            el.classList.add('reveal-target');
            el.dataset.delay = i % 8;
            observer.observe(el);
        });
    }

    function initNavbarIsland() {
        const nav = document.getElementById('kimNavStack');
        if (!nav) return;
        window.addEventListener(
            'scroll',
            () => nav.classList.toggle('scrolled', window.scrollY > 50),
            { passive: true }
        );
    }

    function initHighlight() {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((el) => hljs.highlightElement(el));
        }
    }

    /* =========================================================
     * Canvas fond : jetons rouges/jaunes qui flottent en arrière-plan
     * ========================================================= */
    function initTokensCanvas() {
        const canvas = document.getElementById('tokensCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = 0, height = 0;
        const tokens = [];
        const count = 38;
        const colors = [
            { base: '#ff3b6b', soft: 'rgba(255, 59, 107, 0.18)' },
            { base: '#f5cb1a', soft: 'rgba(245, 203, 26, 0.18)' },
        ];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function spawn() {
            tokens.length = 0;
            for (let i = 0; i < count; i++) {
                const c = colors[i % 2];
                tokens.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: 10 + Math.random() * 18,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    rot: Math.random() * Math.PI * 2,
                    vr: (Math.random() - 0.5) * 0.01,
                    color: c,
                    alpha: 0.25 + Math.random() * 0.35,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            tokens.forEach((t) => {
                t.x += t.vx;
                t.y += t.vy;
                t.rot += t.vr;
                if (t.x < -50) t.x = width + 50;
                if (t.x > width + 50) t.x = -50;
                if (t.y < -50) t.y = height + 50;
                if (t.y > height + 50) t.y = -50;

                ctx.save();
                ctx.globalAlpha = t.alpha;
                const grad = ctx.createRadialGradient(t.x - t.r * 0.3, t.y - t.r * 0.3, 1, t.x, t.y, t.r);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.45, t.color.base);
                grad.addColorStop(1, t.color.soft);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = t.color.base;
                ctx.lineWidth = 1;
                ctx.globalAlpha = Math.min(1, t.alpha + 0.2);
                ctx.stroke();
                ctx.restore();
            });
            requestAnimationFrame(draw);
        }

        resize();
        spawn();
        draw();
        window.addEventListener('resize', () => {
            resize();
            spawn();
        });
    }

    /* =========================================================
     * HERO : plateau Puissance 4 3D interactif (Three.js)
     * ========================================================= */
    function initHeroScene3D() {
        const mount = document.getElementById('heroScene');
        if (!mount || typeof THREE === 'undefined') return;

        const ROWS = 6;
        const COLS = 7;
        const CELL = 0.7;
        const COLOR_BOARD = 0x1e6fd9;
        const COLOR_BOARD_DARK = 0x124a9a;
        const COLOR_RED = 0xff3b6b;
        const COLOR_YELLOW = 0xf5cb1a;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x05060f, 10, 22);

        const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 0.8, 9);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const key = new THREE.DirectionalLight(0xffffff, 0.85);
        key.position.set(5, 8, 6);
        scene.add(key);
        const rim = new THREE.PointLight(0xff3b6b, 1.5, 20);
        rim.position.set(-5, 2, -3);
        scene.add(rim);
        const rim2 = new THREE.PointLight(0xf5cb1a, 1.2, 20);
        rim2.position.set(5, -2, -3);
        scene.add(rim2);

        const boardGroup = new THREE.Group();
        scene.add(boardGroup);

        const boardWidth = COLS * CELL + 0.4;
        const boardHeight = ROWS * CELL + 0.4;

        const boardMat = new THREE.MeshPhongMaterial({ color: COLOR_BOARD, shininess: 60 });
        const boardBack = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, 0.2),
            boardMat
        );
        boardBack.position.z = -0.15;
        boardGroup.add(boardBack);

        const frameMat = new THREE.MeshPhongMaterial({ color: COLOR_BOARD_DARK, shininess: 40 });
        const border = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth + 0.15, boardHeight + 0.15, 0.1),
            frameMat
        );
        border.position.z = -0.22;
        boardGroup.add(border);

        const holeGeo = new THREE.CircleGeometry(CELL * 0.42, 32);
        const holeMat = new THREE.MeshPhongMaterial({ color: 0x050611, shininess: 5 });
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const hole = new THREE.Mesh(holeGeo, holeMat);
                hole.position.set(
                    (c - (COLS - 1) / 2) * CELL,
                    ((ROWS - 1) / 2 - r) * CELL,
                    -0.04
                );
                boardGroup.add(hole);
            }
        }

        const tokenGeo = new THREE.CylinderGeometry(CELL * 0.36, CELL * 0.36, 0.22, 48);
        tokenGeo.rotateX(Math.PI / 2);

        function makeToken(color) {
            const mat = new THREE.MeshPhongMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0.22,
                shininess: 90,
                specular: 0xffffff,
            });
            return new THREE.Mesh(tokenGeo, mat);
        }

        const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        const tokens = [];

        function addToken(col, color) {
            let row = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (!board[r][col]) {
                    row = r;
                    break;
                }
            }
            if (row < 0) return null;
            const token = makeToken(color);
            const x = (col - (COLS - 1) / 2) * CELL;
            const yFinal = ((ROWS - 1) / 2 - row) * CELL;
            token.position.set(x, (ROWS / 2) * CELL + 2, 0);
            token.userData = {
                vy: 0,
                yTarget: yFinal,
                resting: false,
                bouncesLeft: 2,
                birth: performance.now(),
            };
            board[row][col] = token;
            tokens.push(token);
            boardGroup.add(token);
            return token;
        }

        const demoSequence = [
            { col: 3, color: COLOR_RED },
            { col: 3, color: COLOR_YELLOW },
            { col: 2, color: COLOR_RED },
            { col: 4, color: COLOR_YELLOW },
            { col: 4, color: COLOR_RED },
            { col: 2, color: COLOR_YELLOW },
            { col: 5, color: COLOR_RED },
            { col: 1, color: COLOR_YELLOW },
            { col: 3, color: COLOR_RED },
            { col: 0, color: COLOR_YELLOW },
            { col: 6, color: COLOR_RED },
            { col: 5, color: COLOR_YELLOW },
        ];

        let step = 0;
        function scheduleNext() {
            setTimeout(() => {
                const m = demoSequence[step % demoSequence.length];
                addToken(m.col, m.color);
                step++;
                if (step % demoSequence.length === 0) {
                    setTimeout(() => resetBoard(), 1400);
                } else {
                    scheduleNext();
                }
            }, 820);
        }

        function resetBoard() {
            tokens.forEach((t) => boardGroup.remove(t));
            tokens.length = 0;
            for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) board[r][c] = null;
            scheduleNext();
        }

        scheduleNext();

        const GRAVITY = -0.045;
        function animate() {
            requestAnimationFrame(animate);

            tokens.forEach((t) => {
                if (t.userData.resting) return;
                t.userData.vy += GRAVITY;
                t.position.y += t.userData.vy;

                if (t.position.y <= t.userData.yTarget) {
                    t.position.y = t.userData.yTarget;
                    if (t.userData.bouncesLeft > 0 && Math.abs(t.userData.vy) > 0.12) {
                        t.userData.vy = -t.userData.vy * 0.35;
                        t.userData.bouncesLeft--;
                    } else {
                        t.userData.vy = 0;
                        t.userData.resting = true;
                    }
                }
            });

            const t = performance.now() * 0.001;
            boardGroup.rotation.y = Math.sin(t * 0.45) * 0.32;
            boardGroup.rotation.x = Math.sin(t * 0.35) * 0.12 - 0.08;

            renderer.render(scene, camera);
        }
        animate();

        let manualRotY = 0;
        let targetRotY = 0;
        mount.addEventListener('mousemove', (e) => {
            const rect = mount.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            targetRotY = nx * 0.6;
        });

        function onResize() {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', onResize);
    }

    /* =========================================================
     * 4D VIEWER : plateau 3D qui "rejoue" une partie dans le temps
     * La 4e dimension = le temps (slider + play/pause)
     * ========================================================= */
    function initFourDViewer() {
        const mount = document.getElementById('fourdStage');
        if (!mount || typeof THREE === 'undefined') return;

        const ROWS = 6;
        const COLS = 7;
        const CELL = 0.75;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(44, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 1.2, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const d1 = new THREE.DirectionalLight(0xffffff, 0.7);
        d1.position.set(5, 8, 5);
        scene.add(d1);
        const p1 = new THREE.PointLight(0x1e6fd9, 1.4, 25);
        p1.position.set(-6, 3, -4);
        scene.add(p1);
        const p2 = new THREE.PointLight(0xff3b6b, 1.1, 25);
        p2.position.set(6, -3, -2);
        scene.add(p2);

        const boardGroup = new THREE.Group();
        scene.add(boardGroup);

        const boardW = COLS * CELL + 0.4;
        const boardH = ROWS * CELL + 0.4;
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(boardW, boardH, 0.25),
            new THREE.MeshPhongMaterial({ color: 0x1e6fd9, shininess: 50 })
        );
        back.position.z = -0.15;
        boardGroup.add(back);

        const holeGeo = new THREE.CircleGeometry(CELL * 0.42, 36);
        const holeMat = new THREE.MeshPhongMaterial({ color: 0x050611, shininess: 5 });
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const h = new THREE.Mesh(holeGeo, holeMat);
                h.position.set(
                    (c - (COLS - 1) / 2) * CELL,
                    ((ROWS - 1) / 2 - r) * CELL,
                    -0.02
                );
                boardGroup.add(h);
            }
        }

        const tokenGeo = new THREE.CylinderGeometry(CELL * 0.36, CELL * 0.36, 0.22, 48);
        tokenGeo.rotateX(Math.PI / 2);

        // Coups d'une partie type (RED commence, diagonale victorieuse)
        // couleur: 1 = rouge, 2 = jaune
        const GAME = [
            { col: 3, p: 1 }, { col: 3, p: 2 },
            { col: 4, p: 1 }, { col: 5, p: 2 },
            { col: 5, p: 1 }, { col: 6, p: 2 },
            { col: 2, p: 1 }, { col: 4, p: 2 },
            { col: 5, p: 1 }, { col: 1, p: 2 },
            { col: 6, p: 1 }, { col: 0, p: 2 },
            { col: 6, p: 1 },
        ];

        const tokensMesh = [];

        function makeTokenMesh(color) {
            return new THREE.Mesh(
                tokenGeo,
                new THREE.MeshPhongMaterial({
                    color,
                    emissive: color,
                    emissiveIntensity: 0.25,
                    shininess: 90,
                    specular: 0xffffff,
                })
            );
        }

        function rebuildUpToMove(limit) {
            tokensMesh.forEach((t) => boardGroup.remove(t));
            tokensMesh.length = 0;
            const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            for (let i = 0; i < Math.min(limit, GAME.length); i++) {
                const move = GAME[i];
                let row = -1;
                for (let r = ROWS - 1; r >= 0; r--) {
                    if (!grid[r][move.col]) {
                        row = r;
                        break;
                    }
                }
                if (row < 0) continue;
                grid[row][move.col] = move.p;
                const color = move.p === 1 ? 0xff3b6b : 0xf5cb1a;
                const mesh = makeTokenMesh(color);
                mesh.position.set(
                    (move.col - (COLS - 1) / 2) * CELL,
                    ((ROWS - 1) / 2 - row) * CELL,
                    0
                );
                mesh.userData = { birth: performance.now(), isLatest: i === limit - 1 };
                boardGroup.add(mesh);
                tokensMesh.push(mesh);
            }
        }

        // State of 4D viewer
        const state = {
            currentMove: 0,
            playing: true,
            lastStepAt: performance.now(),
            stepInterval: 900,
        };

        rebuildUpToMove(state.currentMove);
        updatePill();

        function tick() {
            requestAnimationFrame(tick);
            const now = performance.now();

            if (state.playing && now - state.lastStepAt > state.stepInterval) {
                state.lastStepAt = now;
                state.currentMove = (state.currentMove + 1) % (GAME.length + 1);
                rebuildUpToMove(state.currentMove);
                updatePill();
            }

            // Rotation douce et autonome (angle 4D)
            const t = now * 0.001;
            boardGroup.rotation.y = Math.sin(t * 0.35) * 0.45 + 0.1;
            boardGroup.rotation.x = Math.sin(t * 0.25) * 0.18 - 0.1;

            // Pulse du dernier jeton
            tokensMesh.forEach((m) => {
                if (m.userData.isLatest) {
                    const age = (now - m.userData.birth) / 1000;
                    const s = 1 + Math.max(0, 0.35 - age * 0.6) * Math.sin(age * 10) * 0.6;
                    m.scale.set(s, s, s);
                } else {
                    m.scale.set(1, 1, 1);
                }
            });

            renderer.render(scene, camera);
        }
        tick();

        function updatePill() {
            const pill = document.getElementById('fourdStep');
            if (pill) {
                pill.innerHTML = `Coup <b>${state.currentMove}</b> / ${GAME.length}`;
            }
        }

        // Contrôles play/pause + reset + next + prev
        const btnPlay = document.getElementById('fourdPlay');
        const btnReset = document.getElementById('fourdReset');
        const btnNext = document.getElementById('fourdNext');
        const btnPrev = document.getElementById('fourdPrev');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                state.playing = !state.playing;
                btnPlay.classList.toggle('active', state.playing);
                btnPlay.innerHTML = state.playing
                    ? '<i class="fas fa-pause"></i> Pause'
                    : '<i class="fas fa-play"></i> Lecture';
            });
        }
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                state.currentMove = 0;
                rebuildUpToMove(0);
                updatePill();
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                state.playing = false;
                if (btnPlay) {
                    btnPlay.classList.remove('active');
                    btnPlay.innerHTML = '<i class="fas fa-play"></i> Lecture';
                }
                state.currentMove = Math.min(GAME.length, state.currentMove + 1);
                rebuildUpToMove(state.currentMove);
                updatePill();
            });
        }
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                state.playing = false;
                if (btnPlay) {
                    btnPlay.classList.remove('active');
                    btnPlay.innerHTML = '<i class="fas fa-play"></i> Lecture';
                }
                state.currentMove = Math.max(0, state.currentMove - 1);
                rebuildUpToMove(state.currentMove);
                updatePill();
            });
        }

        if (btnPlay) btnPlay.classList.add('active');

        function onResize() {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', onResize);
    }
})();
