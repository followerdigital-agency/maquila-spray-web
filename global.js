// ===== Maquila Spray — interactividad del sitio =====
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menú móvil ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');

  function openMenu() {
    mobileNav.classList.add('is-open');
    mobileNavOverlay.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileNav.classList.remove('is-open');
    mobileNavOverlay.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (mobileNav.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });
  }
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Formulario de contacto ---------- */
  // Servicio usado: Web3Forms (https://web3forms.com) — envía el contenido del
  // formulario por correo a la dirección configurada, sin necesidad de backend propio.
  // IMPORTANTE: reemplazar el valor de WEB3FORMS_ACCESS_KEY por la access key real
  // (ver README incluido en esta carpeta para el paso a paso).
  var WEB3FORMS_ACCESS_KEY = 'REEMPLAZA_CON_TU_ACCESS_KEY';
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  var form = document.getElementById('contactoForm');
  var feedback = document.getElementById('formFeedback');
  var feedbackTitle = document.getElementById('formFeedbackTitle');
  var feedbackText = document.getElementById('formFeedbackText');
  var submitBtn = document.getElementById('formSubmitBtn');

  function setFieldError(fieldName, show) {
    var group = form.querySelector('[data-field="' + fieldName + '"]');
    if (group) group.classList.toggle('has-error', show);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    var valid = true;
    var nombre = form.querySelector('#f-nombre').value.trim();
    var correo = form.querySelector('#f-correo').value.trim();

    setFieldError('nombre', false);
    setFieldError('correo', false);

    if (!nombre) { setFieldError('nombre', true); valid = false; }
    if (!correo || !isValidEmail(correo)) { setFieldError('correo', true); valid = false; }

    return valid;
  }

  function showFeedback(success, title, text) {
    form.classList.add('is-hidden');
    feedback.classList.remove('is-error');
    if (!success) feedback.classList.add('is-error');
    feedbackTitle.textContent = title;
    feedbackText.textContent = text;
    feedback.classList.add('is-visible');
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      var btnText = submitBtn.querySelector('.btn-text');
      var originalText = btnText.textContent;
      submitBtn.disabled = true;
      btnText.textContent = 'Enviando...';

      var formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', 'Nueva solicitud desde maquilaspray.com');
      formData.append('from_name', 'Sitio web Maquila Spray');

      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          submitBtn.disabled = false;
          btnText.textContent = originalText;
          if (data.success) {
            showFeedback(true, '¡Solicitud enviada!', 'Gracias por escribirnos. Tu mensaje fue enviado a direccion@maquilaspray.com — te contactaremos en menos de 24 horas.');
            form.reset();
          } else {
            showFeedback(false, 'No se pudo enviar', 'Ocurrió un problema al enviar tu solicitud. Por favor escríbenos directamente a direccion@maquilaspray.com o por WhatsApp al 729 109 6737.');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          btnText.textContent = originalText;
          showFeedback(false, 'No se pudo enviar', 'Ocurrió un problema de conexión. Por favor escríbenos directamente a direccion@maquilaspray.com o por WhatsApp al 729 109 6737.');
        });
    });
  }
});
