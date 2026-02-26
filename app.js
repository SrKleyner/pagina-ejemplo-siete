/**
 * SIETE - Core Interactivity
 * Coded by: Senior Full Stack Developer
 * Description: Vanilla JS execution for high-performance UI interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor Logic ---
    // En diseños maximalistas, reemplazar el cursor del sistema integra al usuario en el lienzo.
    const cursor = document.getElementById("cursor");
    const interactiveElements = document.querySelectorAll("a, button, .nav-item");

    document.addEventListener("mousemove", (e) => {
        // Usamos requestAnimationFrame implícito del navegador, pero transform es GPU-accelerated.
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });


    // --- 2. Sidebar Toggle Logic ---
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");
    const navLinks = document.querySelectorAll(".nav-item");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
        
        // Cambiar el ícono entre hamburguesa y X
        const icon = toggleBtn.querySelector("i");
        if (sidebar.classList.contains("expanded")) {
            icon.classList.replace("ph-list", "ph-x");
        } else {
            icon.classList.replace("ph-x", "ph-list");
        }
    });

    // Auto-colapsar sidebar al hacer clic en un link (UX para pantallas pequeñas/medianas)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains("expanded")) {
                sidebar.classList.remove("expanded");
                toggleBtn.querySelector("i").classList.replace("ph-x", "ph-list");
            }
        });
    });


    // --- 3. Scroll Reveal Animations ---
    // Intersection Observer es más performante que escuchar eventos de scroll
    const revealElements = document.querySelectorAll(".reveal-up");

    const revealOptions = {
        threshold: 0.15, // Ejecuta cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
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

    revealElements.forEach(el => revealOnScroll.observe(el));
});