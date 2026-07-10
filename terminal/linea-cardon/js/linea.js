/* ============================================================
   EXPRESO EL CARDÓN — JavaScript propio de la página de línea
   Autor: Ricardo Salomon Samson Sanchez — UADE — DDW 2026
   ------------------------------------------------------------
   Tres funcionalidades:
   1. Estado del servicio según la hora real (abierto/cerrado).
   2. Cálculo de la próxima salida desde la tabla de horarios.
   3. Buscador que filtra las paradas del recorrido en vivo.
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1 y 2. ESTADO DEL SERVICIO Y PRÓXIMA SALIDA
   Los horarios reales de salida desde Salta viven en un array.
   Con el objeto Date comparamos la hora actual contra la tabla.
------------------------------------------------------------ */

// Horarios de salida desde Salta, en minutos desde la medianoche.
// Ej.: 06:30 → 6*60+30 = 390. Trabajar en minutos simplifica comparar.
const salidasDesdeSalta = [
  { hora: "06:30", minutos: 390 },
  { hora: "09:00", minutos: 540 },
  { hora: "11:30", minutos: 690 },
  { hora: "14:30", minutos: 870 },
  { hora: "17:00", minutos: 1020 },
  { hora: "19:30", minutos: 1170 }
];

const textoEstado = document.getElementById("textoEstado");
const puntoEstado = document.getElementById("puntoEstado");
const proximaSalida = document.getElementById("proximaSalida");

if (textoEstado && proximaSalida) {
  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  // find() devuelve la primera salida cuyo horario todavía no pasó
  const siguiente = salidasDesdeSalta.find((salida) => salida.minutos > minutosAhora);

  if (siguiente) {
    const faltan = siguiente.minutos - minutosAhora;
    // Convertimos los minutos que faltan a formato "X h Y min"
    const horas = Math.floor(faltan / 60);
    const minutos = faltan % 60;
    const texto = horas > 0 ? `${horas} h ${minutos} min` : `${minutos} min`;

    textoEstado.textContent = `Servicio operativo · próxima salida ${siguiente.hora}`;
    puntoEstado.style.backgroundColor = "#2e7d46"; // verde: todo en orden
    proximaSalida.textContent = `${siguiente.hora} (falta ${texto})`;
  } else {
    // Ya pasó la última salida del día: la próxima es la primera de mañana
    textoEstado.textContent = "Últimas salidas finalizadas · retomamos 06:30";
    puntoEstado.style.backgroundColor = "#b98a12"; // dorado: fuera de horario
    proximaSalida.textContent = "06:30 de mañana (primera salida del día)";
  }
}

/* ------------------------------------------------------------
   3. BUSCADOR DE PARADAS
   Escucha el evento "input" (cada tecla) y compara el texto
   buscado contra el nombre de cada parada. Las que no coinciden
   se ocultan con display:none. Sin recargar la página.
------------------------------------------------------------ */
const buscadorParadas = document.getElementById("buscadorParadas");
const sinResultados = document.getElementById("sinResultados");

if (buscadorParadas) {
  // querySelectorAll devuelve TODAS las paradas de la lista
  const paradas = document.querySelectorAll("#listaParadas .parada");

  buscadorParadas.addEventListener("input", () => {
    // toLowerCase(): la búsqueda no distingue mayúsculas de minúsculas
    const buscado = buscadorParadas.value.trim().toLowerCase();
    let visibles = 0;

    paradas.forEach((parada) => {
      // El nombre de la parada está en el <h3> de cada ítem
      const nombre = parada.querySelector("h3").textContent.toLowerCase();
      const coincide = nombre.includes(buscado);

      parada.style.display = coincide ? "" : "none";
      if (coincide) {
        visibles = visibles + 1; // contador de resultados
      }
    });

    // Si ninguna parada coincide, avisamos con un mensaje claro
    sinResultados.style.display = visibles === 0 ? "block" : "none";
  });
}
