/**
 * Blog univers — galaxie, WebGL 3D (Three.js), progression de lecture « 4DX »,
 * parallax léger, carrousel témoignages, révélations au scroll.
 */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let galaxyEffect = null;
    let blogWebglCleanup = null;

    function initGalaxy() {
        const container = document.getElementById("galaxy-container");
        if (!container || typeof GalaxyEffect === "undefined") return;
        try {
            galaxyEffect = new GalaxyEffect(
                container,
                typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
            );
        } catch (e) {
            console.warn("Blog GalaxyEffect:", e);
        }
    }

    /**
     * Scène 3D + évolution temporelle (axe « 4D ») : rotation modulée par le temps.
     */
    function initBlogWebGL() {
        const host = document.getElementById("blog-webgl-host");
        if (!host || typeof THREE === "undefined") return;
        if (reduceMotion) {
            host.style.display = "none";
            return;
        }

        let renderer;
        let scene;
        let camera;
        let group;
        let particles;
        let rafId;
        const cleanupFns = [];

        try {
            const w = host.clientWidth || 600;
            const h = host.clientHeight || 600;

            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x030712, 0.045);

            camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 120);
            camera.position.set(0, 0.2, 5.2);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0);
            host.appendChild(renderer.domElement);

            group = new THREE.Group();
            scene.add(group);

            const knot = new THREE.Mesh(
                new THREE.TorusKnotGeometry(0.85, 0.22, 128, 16),
                new THREE.MeshBasicMaterial({
                    color: 0x22d3ee,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.42,
                })
            );
            group.add(knot);

            const inner = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.55, 1),
                new THREE.MeshBasicMaterial({
                    color: 0xa855f7,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.28,
                })
            );
            group.add(inner);

            for (let i = 0; i < 3; i++) {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(1.35 + i * 0.35, 0.014, 8, 80),
                    new THREE.MeshBasicMaterial({
                        color: i === 1 ? 0xf59e0b : 0x22d3ee,
                        transparent: true,
                        opacity: 0.22 - i * 0.04,
                    })
                );
                ring.rotation.x = Math.PI / 2 + i * 0.4;
                ring.rotation.y = i * 0.7;
                group.add(ring);
            }

            const particleCount = 2200;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                const r = 2.5 + Math.random() * 4;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);
            }
            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            particles = new THREE.Points(
                pGeo,
                new THREE.PointsMaterial({
                    color: 0x7dd3fc,
                    size: 0.035,
                    transparent: true,
                    opacity: 0.55,
                    sizeAttenuation: true,
                })
            );
            scene.add(particles);

            let mx = 0;
            let my = 0;
            function onPointer(e) {
                const rect = host.getBoundingClientRect();
                mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            }
            window.addEventListener("pointermove", onPointer, { passive: true });
            cleanupFns.push(() => window.removeEventListener("pointermove", onPointer));

            function tick() {
                rafId = requestAnimationFrame(tick);
                const t = Date.now() * 0.001;
                group.rotation.y = t * 0.35;
                group.rotation.x = Math.sin(t * 0.2) * 0.15;
                knot.rotation.z = t * 0.5;
                inner.rotation.y = -t * 0.4;
                particles.rotation.y = t * 0.08;
                camera.position.x += (mx * 0.35 - camera.position.x) * 0.05;
                camera.position.y += (-my * 0.25 - camera.position.y) * 0.05;
                camera.lookAt(0, 0, 0);
                renderer.render(scene, camera);
            }
            tick();

            function onResize() {
                const rw = host.clientWidth;
                const rh = host.clientHeight;
                if (rw < 1 || rh < 1) return;
                camera.aspect = rw / rh;
                camera.updateProjectionMatrix();
                renderer.setSize(rw, rh);
            }
            window.addEventListener("resize", onResize);
            cleanupFns.push(() => window.removeEventListener("resize", onResize));
        } catch (e) {
            console.warn("Blog WebGL:", e);
            if (host) host.style.display = "none";
            return;
        }

        blogWebglCleanup = () => {
            if (rafId) cancelAnimationFrame(rafId);
            cleanupFns.forEach((fn) => fn());
            if (renderer) {
                renderer.dispose();
                if (renderer.domElement && renderer.domElement.parentNode) {
                    renderer.domElement.parentNode.removeChild(renderer.domElement);
                }
            }
        };
    }

    /** Barre de progression de lecture (immersion type « 4DX » scroll-linked). */
    function initScrollProgress() {
        const el = document.getElementById("blogScrollProgress");
        if (!el || reduceMotion) return;

        function update() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const p = max > 0 ? Math.round((scrollTop / max) * 100) : 0;
            el.style.setProperty("--blog-read", `${p}%`);
            el.setAttribute("aria-valuenow", String(p));
        }

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        update();
    }

    /** Parallax doux sur le hero (profondeur perçue). */
    function initHeroParallax() {
        const layers = document.querySelectorAll("[data-blog-parallax]");
        if (!layers.length || reduceMotion) return;

        function onMove(e) {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            layers.forEach((layer) => {
                const str = parseFloat(layer.getAttribute("data-blog-parallax") || "0.08");
                layer.style.transform = `translate3d(${dx * str * 28}px, ${dy * str * 20}px, 0)`;
            });
        }

        window.addEventListener("pointermove", onMove, { passive: true });
    }

    function initReveal() {
        if (reduceMotion) {
            document.querySelectorAll(".dk-reveal").forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const els = document.querySelectorAll(".dk-reveal");
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                });
            },
            { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );

        els.forEach((el) => io.observe(el));
    }

    function initStaggerChildren() {
        if (reduceMotion) return;
        document.querySelectorAll("[data-stagger]").forEach((container) => {
            const children = container.querySelectorAll("[data-stagger-item]");
            children.forEach((child, i) => {
                child.style.setProperty("--stagger-delay", `${0.06 * i}s`);
            });
        });
    }

    function initTestimonialsCarousel() {
        const root = document.querySelector("[data-testimonials-root]");
        if (!root) return;

        const slides = root.querySelectorAll(".dk-testimonial-slide");
        const dots = root.querySelectorAll(".dk-testimonial-dot");
        const prev = document.getElementById("dkTestimonialPrev");
        const next = document.getElementById("dkTestimonialNext");
        if (!slides.length) return;

        let index = 0;
        const n = slides.length;

        function go(target) {
            index = ((target % n) + n) % n;
            slides.forEach((slide, j) => {
                const active = j === index;
                slide.classList.toggle("is-active", active);
                slide.setAttribute("aria-hidden", active ? "false" : "true");
            });
            dots.forEach((dot, j) => {
                const active = j === index;
                dot.classList.toggle("is-active", active);
                dot.setAttribute("aria-selected", active ? "true" : "false");
            });
        }

        prev?.addEventListener("click", () => go(index - 1));
        next?.addEventListener("click", () => go(index + 1));
        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                const goIdx = parseInt(dot.getAttribute("data-go"), 10);
                if (!Number.isNaN(goIdx)) go(goIdx);
            });
        });

        root.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(index - 1);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                go(index + 1);
            }
        });

        if (!reduceMotion) {
            let t = setInterval(() => go(index + 1), 7000);
            function stopAuto() {
                clearInterval(t);
                t = null;
            }
            function startAuto() {
                if (t) clearInterval(t);
                t = setInterval(() => go(index + 1), 7000);
            }
            root.addEventListener("mouseenter", stopAuto);
            root.addEventListener("mouseleave", startAuto);
            root.addEventListener("focusin", stopAuto);
            root.addEventListener("focusout", startAuto);
        }
    }

    function initBlogPostFilters() {
        const buttons = document.querySelectorAll(".blog-topic-filter__btn");
        const posts = document.querySelectorAll(".blog-post-card[data-blog-category]");
        if (!buttons.length || !posts.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const filter = btn.getAttribute("data-blog-filter") || "all";
                buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

                posts.forEach((post) => {
                    const category = post.getAttribute("data-blog-category") || "";
                    const visible = filter === "all" || category === filter;
                    post.classList.toggle("is-hidden", !visible);
                });
            });
        });
    }

    function initFooterYear() {
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }

    function boot() {
        initGalaxy();
        initBlogWebGL();
        initScrollProgress();
        initHeroParallax();
        initReveal();
        initStaggerChildren();
        initBlogPostFilters();
        initTestimonialsCarousel();
        initFooterYear();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    window.addEventListener("beforeunload", () => {
        if (galaxyEffect && galaxyEffect.destroy) galaxyEffect.destroy();
        if (typeof blogWebglCleanup === "function") blogWebglCleanup();
    });
})();
