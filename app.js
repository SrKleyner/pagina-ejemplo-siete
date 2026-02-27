/**
 * SIETE - Core Interactivity
 * Coded by: Senior Full Stack Developer
 * Description: Vanilla JS execution for high-performance UI interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Custom Cursor Logic ---
  // En diseños maximalistas, reemplazar el cursor del sistema integra al usuario en el lienzo.
  const cursor = document.getElementById("cursor");
  const interactiveElements = document.querySelectorAll(
    "a, button, .nav-item, .toggle-btn, .chat-btn",
  );
  const sidebarIconBtn = document.getElementById("toggleSidebar");

  // Smooth cursor using transform + requestAnimationFrame for better perf
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const ease = 0.22;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    if (cursor)
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  interactiveElements.forEach((el) => {
    el.addEventListener(
      "mouseenter",
      () => cursor && cursor.classList.add("hovering"),
    );
    el.addEventListener(
      "mouseleave",
      () => cursor && cursor.classList.remove("hovering"),
    );
  });

  // --- 2. Sidebar Toggle Logic ---
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const navLinks = document.querySelectorAll(".nav-item");
  // Definimos los strings con el código SVG
  const iconoMenu = `
        <svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>`;

  const iconoFlecha = `
        <svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
        </svg>`;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");

    // Cambiar el ícono entre hamburguesa y X
    if (sidebar.classList.contains("expanded")) {
      sidebarIconBtn.innerHTML = iconoFlecha; // Carga la flecha;
    } else {
      sidebarIconBtn.innerHTML = iconoMenu; // Carga las 3 líneas
    }
  });

  // Auto-colapsar sidebar al hacer clic en un link (UX para pantallas pequeñas/medianas)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains("expanded")) {
        sidebar.classList.remove("expanded");
        sidebarIconBtn.innerHTML = iconoMenu;
      }
    });
  });

  // --- 3. Scroll Reveal Animations ---
  // Intersection Observer es más performante que escuchar eventos de scroll
  const revealElements = document.querySelectorAll(".reveal-up");

  const revealOptions = {
    threshold: 0.22, // Ejecuta cuando el 15% del elemento es visible
    rootMargin: "0px 0px -50px 0px",
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Opcional: Descomentar la siguiente línea si quieres que la animación ocurra solo 1 vez
        // observer.unobserve(entry.target);
      } else {
        // Permite repetir la animación si el usuario scrollea hacia arriba y abajo
        entry.target.classList.remove("active");
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => revealOnScroll.observe(el));

  // 1. Configuración de los 7 premios, sus códigos y colores
  const segments = [
    { label: "10 Giros gratis", code: "PROMO10", color: "#e91e64" }, // Color 1
    { label: "20% cashback", code: "FREESHIP", color: "#2b0028" }, // Color 2
    { label: "50% 3er deposito", code: "PROMO15", color: "#9100fb" }, // Color 3
    { label: "freebet 1000", code: "GIFT24", color: "#095efb" }, // Color 4
    { label: "freebet football", code: "PROMO20", color: "#68cc00" }, // Color 5
    { label: "2K en vivo", code: "BASIC2X1", color: "#f96000" }, // Color 6
    { label: "2lukas en slots", code: "PROMO5", color: "rgba(233, 30, 100, 0.4)" }, // Color 1 atenuado al 60%
  ];

  // 2. Variables de control
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spin-btn");
  const numSegments = segments.length;
  const arcSize = (2 * Math.PI) / numSegments; // Tamaño del ángulo de cada trozo
  let currentRotation = 0; // Rotación acumulada en grados
  let isSpinning = false;

  // Elementos del Modal
  const modal = document.getElementById("prize-modal");
  const prizeNameEl = document.getElementById("prize-name");
  const prizeCodeEl = document.getElementById("prize-code");
  const copyBtn = document.getElementById("copy-btn");
  const closeBtn = document.getElementById("close-btn");
  const copyMsg = document.getElementById("copy-msg");

  // 3. Dibujar la ruleta en el Canvas
  function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
      const angle = i * arcSize - Math.PI / 2; // Empezar arriba (-90 grados)

      // Dibujar el trozo (slice)
      ctx.beginPath();
      ctx.fillStyle = segments[i].color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Agregar borde separador
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Dibujar el texto
      ctx.save();
      ctx.translate(centerX, centerY);
      // Rotar al centro del trozo
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";

      // Sombra para mejor legibilidad en colores claros
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;

      // Ajuste de posición del texto (alejado del centro)
      ctx.fillText(segments[i].label, radius - 20, 8);
      ctx.restore();
    }
  }

  // 4. Lógica de giro
  function spinWheel() {
    // Validación: Evitar múltiples giros si recargan la página (Nivel de seguridad básico)
    if (localStorage.getItem("hasSpun") === "true") {
      alert("¡Ya has girado la ruleta! Usa tu código para registrarte.");
      return;
    }

    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    // Seleccionar un ganador al azar
    const winningIndex = Math.floor(Math.random() * numSegments);

    // --- CÁLCULO DE ÁNGULO ---
    // Grados por cada segmento
    const degreesPerSegment = 360 / numSegments;
    // Ángulo del centro del segmento ganador
    const centerAngleOfWinner =
      winningIndex * degreesPerSegment + degreesPerSegment / 2;
    // Cuánto debemos rotar para que ese centro quede apuntando arriba (0 grados)
    const rotationNeeded = 360 - centerAngleOfWinner;

    // Añadir giros completos extra (ej. 5 a 8 vueltas) para emoción
    const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360;

    // Añadir un pequeño desfase aleatorio para que no caiga siempre exactamente en el centro del trozo
    const randomOffset = (Math.random() - 0.5) * (degreesPerSegment * 0.8);

    // Rotación final
    currentRotation += extraSpins + rotationNeeded + randomOffset;

    // Aplicar rotación vía CSS
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Guardar en local storage que el usuario ya giró
    localStorage.setItem("hasSpun", "true");

    // Mostrar modal cuando termine la transición (5 segundos definidos en CSS)
    setTimeout(() => {
      showPrize(segments[winningIndex]);
      isSpinning = false;
    }, 5000);
  }

  // 5. Lógica del Pop-up (Modal)
  function showPrize(prize) {
    prizeNameEl.textContent = prize.label;
    prizeCodeEl.textContent = prize.code;
    modal.classList.add("active");
  }

  // Copiar al portapapeles
  copyBtn.addEventListener("click", () => {
    const textToCopy = prizeCodeEl.textContent;

    // Uso del API del Portapapeles con fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(showCopySuccess);
    } else {
      // Fallback para navegadores antiguos o sin HTTPS
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        showCopySuccess();
      } catch (err) {
        console.error("No se pudo copiar", err);
      }
      document.body.removeChild(textArea);
    }
  });

  function showCopySuccess() {
    copyMsg.style.opacity = "1";
    setTimeout(() => {
      copyMsg.style.opacity = "0";
    }, 2000);
  }

  // Cerrar el modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Inicialización
  drawWheel();

  // Verificar si ya giró al cargar la página para desactivar el botón visualmente
  if (localStorage.getItem("hasSpun") === "true") {
    spinBtn.disabled = true;
    spinBtn.textContent = "Ya participaste";
  }

  // Asignar evento al botón
  spinBtn.addEventListener("click", spinWheel);
});