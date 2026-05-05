/**
 * Interactions thème clair premium : navbar sticky, reveal scroll,
 * barres de competences, formulaire contact, footer.
 */
(function () {
  "use strict";

  var PORTFOLIO_LIGHT = ".portfolio-light";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function initNavbarScroll() {
    var navbar = qs(PORTFOLIO_LIGHT + " .lt-nav.navbar");
    if (!navbar) return;
    var ticking = false;
    function update() {
      navbar.classList.toggle("scrolled", window.scrollY > 48);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function initScrollReveal() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = qsa(PORTFOLIO_LIGHT + " [data-lt-reveal]");
    if (!nodes.length) return;

    if (reduce) {
      nodes.forEach(function (el) {
        el.classList.add("lt-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("lt-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function initSkillBars() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bars = qsa(PORTFOLIO_LIGHT + " .lt-skill__fill[data-lt-width]");
    if (!bars.length) return;

    function fillBar(bar) {
      var w = bar.getAttribute("data-lt-width") || "0%";
      if (reduce) {
        bar.style.width = w;
        return;
      }
      bar.style.width = "0%";
      requestAnimationFrame(function () {
        bar.style.width = w;
      });
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    bars.forEach(function (bar) {
      io.observe(bar);
    });
  }

  function initFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initBackToTop() {
    var btn = qs(PORTFOLIO_LIGHT + " .lt-back-top");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    var feedback = document.getElementById("contactFeedback");
    if (!form) return;

    var nameInput = document.getElementById("contactName");
    var emailInput = document.getElementById("contactEmail");
    var subjectInput = document.getElementById("contactSubject");
    var messageInput = document.getElementById("contactMessage");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";
      var subject = subjectInput ? subjectInput.value.trim() : "";
      var message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !subject || !message) {
        if (feedback) {
          feedback.textContent =
            "Merci de remplir tous les champs du formulaire.";
        }
        return;
      }

      var body = ["Nom: " + name, "Email: " + email, "", message].join("\n");
      var mailto =
        "mailto:divinkimia@protonmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      if (feedback) {
        feedback.textContent =
          "Votre application e-mail va s'ouvrir pour envoyer le message.";
      }
    });
  }

  function initAnchorScroll() {
    qsa('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        var targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        e.preventDefault();
        var navbar = qs(PORTFOLIO_LIGHT + " .lt-nav.navbar");
        var offset = navbar ? navbar.offsetHeight + 24 : 0;
        var top =
          targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.body.classList.contains("portfolio-light")) return;
    initNavbarScroll();
    initScrollReveal();
    initSkillBars();
    initFooterYear();
    initBackToTop();
    initContactForm();
    initAnchorScroll();
  });
})();
