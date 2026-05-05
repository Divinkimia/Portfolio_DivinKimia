(function () {
  "use strict";

  function initFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    var feedback = document.getElementById("contactFeedback");
    var nameInput = document.getElementById("contactName");
    var emailInput = document.getElementById("contactEmail");
    var subjectInput = document.getElementById("contactSubject");
    var messageInput = document.getElementById("contactMessage");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";
      var subject = subjectInput ? subjectInput.value.trim() : "";
      var message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !subject || !message) {
        if (feedback) feedback.textContent = "Merci de remplir tous les champs du formulaire.";
        return;
      }

      var body = [
        "Nom: " + name,
        "Email: " + email,
        "",
        message
      ].join("\n");

      var mailto = "mailto:divinkimia@protonmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      if (feedback) feedback.textContent = "Votre application e-mail va s'ouvrir pour envoyer le message.";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFooterYear();
    initContactForm();
  });
})();
