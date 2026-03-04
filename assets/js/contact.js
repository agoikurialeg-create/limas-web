(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const alertBox = document.getElementById('contactAlert');
  const btn = document.getElementById('contactBtn');

  const phoneOk = (v) => !v || /^[0-9+\-\s()]{7,20}$/.test(v.trim());

  function showAlert(type, msg) {
    alertBox.className = `alert alert-${type} mb-0`;
    alertBox.textContent = msg;
    alertBox.classList.remove('d-none');
  }

  function hideAlert() {
    alertBox.classList.add('d-none');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    // Validación HTML5 + Bootstrap styles
    const telefono = form.telefono?.value ?? '';
    if (!phoneOk(telefono)) {
      form.telefono.classList.add('is-invalid');
    } else {
      form.telefono.classList.remove('is-invalid');
    }

    if (!form.checkValidity() || !phoneOk(telefono)) {
      form.classList.add('was-validated');
      showAlert('warning', 'Revisa los campos marcados antes de enviar.');
      return;
    }

    // Botón “cargando”
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'ENVIANDO...';

    try {
      const formData = new FormData(form);

      // OJO: desde /app/... a /php/... es ../php/...
      const res = await fetch('../php/enviar-consulta.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.ok) {
        form.reset();
        form.classList.remove('was-validated');
        showAlert('success', '✔ Consulta enviada. Te responderemos lo antes posible.');
      } else {
        showAlert('danger', data.error || 'No se pudo enviar. Inténtalo en unos minutos.');
      }
    } catch (err) {
      showAlert('danger', 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
})();