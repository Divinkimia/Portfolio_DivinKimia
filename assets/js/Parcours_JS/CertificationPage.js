/**
 * Page Certifications — galaxie, scène Three.js discrète, filtres, révélations au scroll.
 */
let galaxyEffect = null;
let certWebglCleanup = null;

document.addEventListener("DOMContentLoaded", () => {
  try {
    initGalaxyEffect();
    initCertWebGL();
    initCertFilters();
    initCertReveal();
    initFooterYear();
    initNavbarScroll();
  } catch (err) {
    console.error("CertificationPage init:", err);
    document.querySelectorAll(".cert-reveal").forEach((el) => el.classList.add("is-visible"));
  }
});

function initGalaxyEffect() {
  const galaxyContainer = document.getElementById("galaxy-container");
  if (!galaxyContainer) return;

  if (typeof GalaxyEffect !== "undefined") {
    galaxyEffect = new GalaxyEffect(
      galaxyContainer,
      typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
    );
  } else {
    createSimpleStarField(galaxyContainer);
  }
}

function createSimpleStarField(container) {
  const canvas = document.createElement("canvas");
  canvas.id = "stars-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";
  canvas.style.opacity = "0.55";

  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const stars = [];
  const colors = [
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 180, b: 255 },
    { r: 124, g: 199, b: 255 },
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars.length = 0;
    const count = Math.floor((canvas.width * canvas.height) / 16000);
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        color,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      star.twinkle += 0.015;
      const opacity = star.opacity * (Math.sin(star.twinkle) * 0.25 + 0.75);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  animate();
}

/**
 * Scène 3D orientée IA + cybersécurité :
 * noyau "shield", anneau de scan et réseau de noeuds.
 */
function initCertWebGL() {
  const host = document.getElementById("cert-webgl-host");
  if (!host || typeof THREE === "undefined") return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    host.style.display = "none";
    return;
  }

  let renderer;
  let scene;
  let camera;
  let group;
  let rafId;
  const cleanupFns = [];

  try {
    const width = host.clientWidth || 400;
    const height = host.clientHeight || 400;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    group = new THREE.Group();
    scene.add(group);

    const outerGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00b4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.26,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    group.add(outer);

    const shieldGeo = new THREE.CylinderGeometry(0.52, 0.42, 1.25, 6, 1, true);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x7cc7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);

    const coreGeo = new THREE.OctahedronGeometry(0.36, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7cc7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const core = new THREE.Mesh(coreGeo, innerMat);
    group.add(core);

    const ringGeo = new THREE.TorusGeometry(1.45, 0.012, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4cc2ff,
      transparent: true,
      opacity: 0.42,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    group.add(ring);

    const scanGeo = new THREE.TorusGeometry(0.78, 0.01, 6, 72);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      transparent: true,
      opacity: 0.5,
    });
    const scanRing = new THREE.Mesh(scanGeo, scanMat);
    scanRing.rotation.y = Math.PI / 2.8;
    group.add(scanRing);

    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x7cc7ff,
      transparent: true,
      opacity: 0.85,
    });
    const nodeGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const nodeAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
    const nodes = nodeAngles.map((angle, index) => {
      const node = new THREE.Mesh(nodeGeo, nodeMaterial);
      const radius = index % 2 === 0 ? 0.82 : 0.68;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (index % 3 - 1) * 0.18);
      group.add(node);
      return node;
    });

    const linePairs = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 5]
    ];
    const linePositions = [];
    linePairs.forEach(([a, b]) => {
      linePositions.push(nodes[a].position.x, nodes[a].position.y, nodes[a].position.z);
      linePositions.push(nodes[b].position.x, nodes[b].position.y, nodes[b].position.z);
    });
    const networkGeo = new THREE.BufferGeometry();
    networkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const networkMat = new THREE.LineBasicMaterial({
      color: 0x00b4ff,
      transparent: true,
      opacity: 0.35,
    });
    const networkLines = new THREE.LineSegments(networkGeo, networkMat);
    group.add(networkLines);

    function tick() {
      rafId = requestAnimationFrame(tick);
      group.rotation.y += 0.0026;
      group.rotation.x += 0.0009;
      outer.rotation.z += 0.0011;
      shield.rotation.z -= 0.0015;
      core.rotation.y += 0.0034;
      ring.rotation.z += 0.0019;
      scanRing.rotation.x -= 0.0028;
      networkLines.rotation.y += 0.0018;
      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w < 1 || h < 1) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", onResize);
    cleanupFns.push(() => window.removeEventListener("resize", onResize));
  } catch (e) {
    console.warn("CertificationPage WebGL:", e);
    if (host) host.style.display = "none";
    return;
  }

  certWebglCleanup = () => {
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

function initCertFilters() {
  const buttons = document.querySelectorAll(".cert-filter");
  const cards = document.querySelectorAll(".cert-bento .cert-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";
      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

      cards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        const show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          card.classList.remove("is-visible");
          void card.offsetWidth;
          card.classList.add("is-visible");
        }
      });
    });
  });
}

function initCertReveal() {
  const els = document.querySelectorAll(".cert-reveal");
  if (!els.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

window.addEventListener("beforeunload", () => {
  if (galaxyEffect && galaxyEffect.destroy) {
    galaxyEffect.destroy();
  }
  if (typeof certWebglCleanup === "function") {
    certWebglCleanup();
  }
});
