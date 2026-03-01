/* ==========================================
LÓGICA DEL FORMULARIO Y GOOGLE SHEETS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registro-form");
  const submitFormBtn = document.getElementById("submit-btn");
  const formMsg = document.getElementById("form-msg");

  // ⚠️ ARQUITECTURA: Reemplaza esta constante con la URL que te de Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk2PKp1ADQALmVCcBJG25TKyorRlVNblX3kHPVxwDptrPxB943wSwb2rdbfAXx8EBi/exec';

  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // SEGURIDAD FRONTEND: Sanitización básica contra XSS reflejado.
    // Reemplazamos caracteres sensibles por sus entidades HTML.
    const sanitizeInput = (str) => {
      return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    };

    const formData = {
      nombre: sanitizeInput(document.getElementById("nombre").value),
      email: sanitizeInput(document.getElementById("email").value),
      telefono: sanitizeInput(document.getElementById("telefono").value),
      codigo_premio: sanitizeInput(
        document.getElementById("codigo_premio").value,
      ),
    };

    // Feedback visual de carga
    submitFormBtn.disabled = true;
    submitFormBtn.textContent = "Enviando...";
    formMsg.textContent = "";
    formMsg.className = "form-msg";

    try {
      /* Para evitar problemas complejos de CORS (Cross-Origin Resource Sharing) con Google,
                       enviamos la petición como 'text/plain' y el JSON stringificado. */
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });

      // (Este bloque IF es solo para que pruebes el UI antes de configurar Google Sheets)
      if (GOOGLE_SCRIPT_URL === "URL_DE_TU_GOOGLE_APPS_SCRIPT") {
        setTimeout(() => {
          formMsg.textContent = "¡Registro exitoso! (Modo de demostración)";
          formMsg.classList.add("msg-success");
          submitFormBtn.textContent = "Datos Enviados";
          registroForm.reset();
        }, 1200);
        return;
      }

      const result = await response.json();

      if (result.status === "success") {
        formMsg.textContent = "¡Registro completado con éxito!";
        formMsg.classList.add("msg-success");
        registroForm.reset();
        // Prevenir envíos duplicados de forma sencilla
        submitFormBtn.textContent = "Registrado";
      } else {
        throw new Error("Error de validación en el servidor");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      formMsg.textContent = "Hubo un problema. Por favor intenta de nuevo.";
      formMsg.classList.add("msg-error");
      submitFormBtn.disabled = false;
      submitFormBtn.textContent = "Enviar Datos";
    }
  });
});
