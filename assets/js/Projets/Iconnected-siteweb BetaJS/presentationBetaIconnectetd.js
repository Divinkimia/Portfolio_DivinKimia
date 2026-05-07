(function () {
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var root = document.getElementById("presentation-app");
  if (!root) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Révélations au scroll */
  var observed = root.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observed.forEach(function (el) {
      io.observe(el);
    });
  } else {
    observed.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /** Compteurs */
  if (reduceMotion || !("IntersectionObserver" in window)) {
    root.querySelectorAll(".js-counter").forEach(function (el) {
      var t = parseInt(el.getAttribute("data-target"), 10);
      if (!isNaN(t)) el.textContent = String(t);
    });
    return;
  }

  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var counters = root.querySelectorAll(".js-counter");
  var counterIo = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-target"), 10);
        if (!isNaN(target)) animateValue(el, target, 1400);
        counterIo.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach(function (c) {
    counterIo.observe(c);
  });
})();
