/* ============================================================
   SAMSON DIGITAL — JavaScript del sitio de la consultora
   Autor: Ricardo Salomon Samson Sanchez — UADE — DDW 2026
   ------------------------------------------------------------
   Dos comportamientos:
   1. Menú hamburguesa para la vista móvil.
   2. Validación del formulario de contacto.
   (El sitio del proyecto Terminal Güemes tiene su propio JS,
   más completo: js/terminal.js dentro de la carpeta terminal.)
   ============================================================ */

"use strict";

/* 1. MENÚ HAMBURGUESA (igual patrón que en la terminal) */
const botonMenu = document.getElementById("botonMenu");
const navPrincipal = document.getElementById("navPrincipal");

if (botonMenu && navPrincipal) {
  botonMenu.addEventListener("click", () => {
    const abierto = navPrincipal.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
    botonMenu.textContent = abierto ? "✕" : "☰";
  });
}

/* 2. VALIDACIÓN DEL FORMULARIO DE LA CONSULTORA
   Reglas: nombre >= 2 caracteres, email con formato válido,
   mensaje >= 10 caracteres. Los errores se muestran junto a
   cada campo y el éxito se confirma con un mensaje visible. */
const formularioConsultora = document.getElementById("formularioConsultora");

if (formularioConsultora) {
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const marcarCampo = (campo, idError, hayError) => {
    document.getElementById(idError).style.display = hayError ? "block" : "none";
    campo.classList.toggle("campo-invalido", hayError);
  };

  formularioConsultora.addEventListener("submit", (evento) => {
    evento.preventDefault(); // no recargar la página

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const exito = document.getElementById("mensajeExito");

    const errorNombre = nombre.value.trim().length < 2;
    const errorEmail = !patronEmail.test(email.value.trim());
    const errorMensaje = mensaje.value.trim().length < 10;

    marcarCampo(nombre, "errorNombre", errorNombre);
    marcarCampo(email, "errorEmail", errorEmail);
    marcarCampo(mensaje, "errorMensaje", errorMensaje);

    if (!errorNombre && !errorEmail && !errorMensaje) {
      exito.style.display = "block";
      exito.textContent = `¡Gracias, ${nombre.value.trim()}! Tu consulta fue registrada; te escribimos a ${email.value.trim()} dentro de las 48 h.`;
      formularioConsultora.reset();
      setTimeout(() => { exito.style.display = "none"; }, 8000);
    } else {
      exito.style.display = "none";
    }
  });
}
