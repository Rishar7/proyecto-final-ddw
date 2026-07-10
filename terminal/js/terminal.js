/* ============================================================
   TERMINAL GÜEMES — JavaScript principal del sitio
   Autor: Ricardo Salomon Samson Sanchez — UADE — DDW 2026
   ------------------------------------------------------------
   Un solo archivo para las tres páginas de la terminal.
   Cada bloque pregunta primero si el elemento existe en la
   página actual (por ejemplo, el acordeón solo está en
   la-terminal.html); si no existe, ese bloque no se ejecuta.

   Conceptos de la materia aplicados acá:
   - DOM: getElementById / querySelector / querySelectorAll
   - Eventos: addEventListener ("click", "submit", "change")
   - Funciones flecha ( () => {} )
   - const / let según el ámbito de cada variable
   - Arrays de objetos como "base de datos" simulada
   - Manipulación de clases y estilos (classList, dataset)
   - Template strings para generar HTML dinámico
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1. MENÚ HAMBURGUESA (móvil)
   El botón muestra/oculta la navegación agregando o quitando
   la clase "abierto". aria-expanded informa el estado a los
   lectores de pantalla (accesibilidad).
------------------------------------------------------------ */
const botonMenu = document.getElementById("botonMenu");
const navPrincipal = document.getElementById("navPrincipal");

if (botonMenu && navPrincipal) {
  botonMenu.addEventListener("click", () => {
    const abierto = navPrincipal.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
    botonMenu.textContent = abierto ? "✕" : "☰";
  });
}

/* ------------------------------------------------------------
   2. MODO CLARO / OSCURO
   Cambia el atributo data-tema del <html>. Las variables CSS
   hacen el resto. La elección se guarda en localStorage para
   que se recuerde en la próxima visita.
------------------------------------------------------------ */
const botonTema = document.getElementById("botonTema");

// Al cargar la página, recuperamos el tema guardado (si existe)
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado) {
  document.documentElement.setAttribute("data-tema", temaGuardado);
}

if (botonTema) {
  // Función que sincroniza el texto del botón con el tema activo
  const actualizarBotonTema = () => {
    const temaActual = document.documentElement.getAttribute("data-tema");
    botonTema.textContent = temaActual === "oscuro" ? "☀️ Tema" : "🌙 Tema";
  };

  botonTema.addEventListener("click", () => {
    const temaActual = document.documentElement.getAttribute("data-tema");
    const temaNuevo = temaActual === "oscuro" ? "claro" : "oscuro";
    document.documentElement.setAttribute("data-tema", temaNuevo);
    localStorage.setItem("tema", temaNuevo); // persistencia simple del lado del cliente
    actualizarBotonTema();
  });

  actualizarBotonTema();
}

/* ------------------------------------------------------------
   3. BUSCADOR "¿CÓMO LLEGO?" (página de inicio)
   No usa base de datos: los viajes posibles están cargados en
   un array de objetos. Al enviar el formulario se busca la
   combinación origen + destino y se muestra el resultado.
------------------------------------------------------------ */
const formularioViaje = document.getElementById("formularioViaje");
const resultadoViaje = document.getElementById("resultadoViaje");

// "Base de datos" simulada de combinaciones de viaje
const viajes = [
  { origen: "terminal", destino: "san-lorenzo", servicio: "C1 · Centro – San Lorenzo", anden: "Andén 1", duracion: "35 min", tarifa: "$ 490", frecuencia: 12, color: "var(--c1-verde)" },
  { origen: "plaza", destino: "san-lorenzo", servicio: "C1 · Centro – San Lorenzo", anden: "Parada Plaza 9 de Julio", duracion: "28 min", tarifa: "$ 490", frecuencia: 12, color: "var(--c1-verde)" },
  { origen: "terminal", destino: "cerro", servicio: "C2 · Centro – Cerro San Bernardo", anden: "Andén 2", duracion: "18 min", tarifa: "$ 490", frecuencia: 20, color: "var(--c2-azul)" },
  { origen: "plaza", destino: "cerro", servicio: "C2 · Centro – Cerro San Bernardo", anden: "Parada Güemes", duracion: "12 min", tarifa: "$ 490", frecuencia: 20, color: "var(--c2-azul)" },
  { origen: "universidad", destino: "cerro", servicio: "C2 · Centro – Cerro San Bernardo", anden: "Parada Universidad", duracion: "25 min", tarifa: "$ 490", frecuencia: 20, color: "var(--c2-azul)" },
  { origen: "terminal", destino: "carril", servicio: "V1 · Valle de Lerma", anden: "Andén 3", duracion: "50 min", tarifa: "$ 900", frecuencia: 30, color: "var(--v1-dorado)" },
  { origen: "terminal", destino: "chicoana", servicio: "V1 · Valle de Lerma", anden: "Andén 3", duracion: "1 h 10 min", tarifa: "$ 1.100", frecuencia: 30, color: "var(--v1-dorado)" },
  { origen: "universidad", destino: "carril", servicio: "V1 · Valle de Lerma", anden: "Parada Universidad", duracion: "40 min", tarifa: "$ 900", frecuencia: 30, color: "var(--v1-dorado)" },
  { origen: "terminal", destino: "cafayate", servicio: "EC · Expreso El Cardón", anden: "Andén 5", duracion: "3 h 30 min", tarifa: "$ 12.500", frecuencia: 180, color: "var(--ec-terracota)", enlace: "linea-cardon/index.html" },
  { origen: "plaza", destino: "cafayate", servicio: "EC · Expreso El Cardón (salís desde la Terminal)", anden: "Andén 5", duracion: "3 h 45 min", tarifa: "$ 12.500", frecuencia: 180, color: "var(--ec-terracota)", enlace: "linea-cardon/index.html" },
  { origen: "universidad", destino: "san-lorenzo", servicio: "C1 · Centro – San Lorenzo (combinás en Plaza 9 de Julio)", anden: "Parada Universidad", duracion: "45 min", tarifa: "$ 980 (2 tramos)", frecuencia: 12, color: "var(--c1-verde)" }
];

// Calcula cuántos minutos faltan para la próxima salida según la frecuencia
const minutosParaProxima = (frecuencia) => {
  const ahora = new Date();
  const minutosDelDia = ahora.getHours() * 60 + ahora.getMinutes();
  // El resto de la división indica cuánto pasó desde la última salida
  return frecuencia - (minutosDelDia % frecuencia);
};

if (formularioViaje && resultadoViaje) {
  formularioViaje.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue al enviar

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    // Validación simple: los dos campos son obligatorios
    if (origen === "" || destino === "") {
      resultadoViaje.innerHTML = "<h4>Faltan datos</h4><p>Elegí un origen y un destino para poder recomendarte un servicio.</p>";
      resultadoViaje.classList.add("visible");
      return;
    }

    // find() devuelve el primer objeto del array que cumple la condición
    const viaje = viajes.find((v) => v.origen === origen && v.destino === destino);

    if (viaje) {
      const faltan = minutosParaProxima(viaje.frecuencia);
      resultadoViaje.style.borderLeftColor = viaje.color;
      resultadoViaje.innerHTML = `
        <h4>Tu viaje recomendado</h4>
        <ul>
          <li><strong>Servicio:</strong> ${viaje.servicio}</li>
          <li><strong>Salida:</strong> ${viaje.anden}</li>
          <li><strong>Próxima salida:</strong> en ${faltan} minutos aprox.</li>
          <li><strong>Duración estimada:</strong> ${viaje.duracion}</li>
          <li><strong>Tarifa:</strong> ${viaje.tarifa}</li>
        </ul>
        ${viaje.enlace ? `<p style="margin-top:0.6rem;"><a href="${viaje.enlace}"><strong>Ver la página completa del servicio →</strong></a></p>` : ""}
      `;
    } else {
      // Mensaje de error claro: el usuario siempre sabe qué pasó
      resultadoViaje.style.borderLeftColor = "var(--corte)";
      resultadoViaje.innerHTML = "<h4>No encontramos esa combinación</h4><p>Ese trayecto todavía no está cargado en el simulador. Probá saliendo desde la Terminal Güemes, que concentra todos los servicios.</p>";
    }

    resultadoViaje.classList.add("visible");
  });
}

/* ------------------------------------------------------------
   4. ALERTAS EN TIEMPO REAL (página de inicio)
   Las novedades viven en un array de objetos y se dibujan en
   el HTML con un forEach. En un sitio real vendrían de una API
   del lado del servidor; acá se simulan del lado del cliente.
------------------------------------------------------------ */
const listaAlertas = document.getElementById("listaAlertas");

const alertas = [
  { estado: "ok", titulo: "C1 y C2 operan con normalidad", detalle: "Frecuencias habituales en toda la red urbana.", hace: 8 },
  { estado: "alerta", titulo: "V1: demoras de 10 minutos", detalle: "Obras sobre la RN 68 a la altura de Cerrillos. Servicio con demoras leves.", hace: 42 },
  { estado: "corte", titulo: "EC: salida de las 14:30 reprogramada", detalle: "Por viento zonda en la Quebrada de las Conchas, la salida pasa a las 16:00.", hace: 95 }
];

if (listaAlertas) {
  alertas.forEach((alerta) => {
    // Calculamos la hora real de publicación restando minutos a la hora actual
    const fecha = new Date(Date.now() - alerta.hace * 60000);
    const hora = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    // createElement + innerHTML: generamos cada tarjeta de alerta
    const item = document.createElement("li");
    item.className = "alerta-item";
    item.innerHTML = `
      <span class="punto-estado estado-${alerta.estado}" aria-hidden="true"></span>
      <div>
        <strong>${alerta.titulo}</strong>
        <p>${alerta.detalle}</p>
        <time>Publicado a las ${hora} · hace ${alerta.hace} min</time>
      </div>
    `;
    listaAlertas.appendChild(item);
  });
}

/* ------------------------------------------------------------
   5. PIZARRA DE PRÓXIMAS SALIDAS + RELOJ (página de inicio)
   Usa el objeto Date para calcular, según la frecuencia de
   cada servicio, los horarios reales de las próximas salidas.
   setInterval refresca el reloj cada segundo.
------------------------------------------------------------ */
const cuerpoPizarra = document.getElementById("cuerpoPizarra");
const relojTerminal = document.getElementById("relojTerminal");

const serviciosPizarra = [
  { codigo: "C1", destino: "San Lorenzo", frecuencia: 12, anden: "1" },
  { codigo: "C2", destino: "Cerro San Bernardo", frecuencia: 20, anden: "2" },
  { codigo: "V1", destino: "Chicoana (por El Carril)", frecuencia: 30, anden: "3" },
  { codigo: "EC", destino: "Cafayate", frecuencia: 180, anden: "5" }
];

// Suma minutos a la hora actual y la devuelve con formato HH:MM
const horaMasMinutos = (minutos) => {
  const fecha = new Date(Date.now() + minutos * 60000);
  return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
};

const dibujarPizarra = () => {
  cuerpoPizarra.innerHTML = ""; // se limpia y se vuelve a dibujar
  serviciosPizarra.forEach((servicio) => {
    const faltan = minutosParaProxima(servicio.frecuencia);
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><strong>${servicio.codigo}</strong></td>
      <td>${servicio.destino}</td>
      <td>${horaMasMinutos(faltan)} <small>(en ${faltan} min)</small></td>
      <td class="anden">${servicio.anden}</td>
    `;
    cuerpoPizarra.appendChild(fila);
  });
};

if (cuerpoPizarra && relojTerminal) {
  const actualizarReloj = () => {
    relojTerminal.textContent = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  dibujarPizarra();
  actualizarReloj();
  setInterval(actualizarReloj, 1000);   // el reloj late cada segundo
  setInterval(dibujarPizarra, 30000);   // la pizarra se recalcula cada 30 s
}

/* ------------------------------------------------------------
   6. PLANO INTERACTIVO DE LA TERMINAL (la-terminal.html)
   Cada punto del plano SVG es un elemento con data-info.
   Al hacer clic (o foco con teclado), el panel lateral muestra
   la información de ese lugar. Es la idea del "plano clickeable".
------------------------------------------------------------ */
const puntosPlano = document.querySelectorAll(".punto-plano");
const infoPlano = document.getElementById("infoPlano");

if (puntosPlano.length > 0 && infoPlano) {
  const mostrarInfo = (punto) => {
    // dataset lee los atributos data-titulo y data-detalle del SVG
    infoPlano.innerHTML = `
      <h4>${punto.dataset.titulo}</h4>
      <p>${punto.dataset.detalle}</p>
    `;
    // Marca visual del sector activo: se quita de todos y se pone en el elegido
    puntosPlano.forEach((otro) => otro.classList.remove("seleccionado"));
    punto.classList.add("seleccionado");
  };

  puntosPlano.forEach((punto) => {
    punto.addEventListener("click", () => mostrarInfo(punto));
    // Accesibilidad: también responde al teclado (Enter o barra espaciadora)
    punto.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        mostrarInfo(punto);
      }
    });
  });

  // DEEP LINK: si la URL llega con un hash (por ejemplo la-terminal.html#zona-anden-v1
  // desde la tarjeta V1 de la portada), se abre directamente la información
  // de ese sector del plano. location.hash devuelve "#zona-anden-v1".
  const hash = window.location.hash;
  if (hash) {
    const objetivo = document.getElementById(hash.substring(1)); // saca el "#"
    if (objetivo && objetivo.classList.contains("punto-plano")) {
      mostrarInfo(objetivo);
      objetivo.focus(); // lleva el foco (y el scroll) hasta el sector
    }
  }
}

/* ------------------------------------------------------------
   7. PREGUNTAS FRECUENTES: ACORDEÓN (la-terminal.html)
   querySelectorAll toma TODAS las preguntas; a cada una se le
   asocia un evento click que abre/cierra su respuesta.
------------------------------------------------------------ */
const preguntasFaq = document.querySelectorAll(".faq-pregunta");

preguntasFaq.forEach((pregunta) => {
  pregunta.addEventListener("click", () => {
    const item = pregunta.parentElement;          // el contenedor .faq-item
    const estabaAbierto = item.classList.contains("abierto");

    // Primero cerramos todos (solo un ítem abierto a la vez)
    document.querySelectorAll(".faq-item").forEach((otro) => otro.classList.remove("abierto"));

    // Si estaba cerrado, lo abrimos
    if (!estabaAbierto) {
      item.classList.add("abierto");
    }
  });
});

/* ------------------------------------------------------------
   8. VALIDACIÓN DEL FORMULARIO DE CONTACTO (contacto.html)
   Validación del lado del cliente ANTES de enviar:
   - nombre: mínimo 2 caracteres
   - email: formato usuario@dominio (expresión regular)
   - servicio: hay que elegir una opción
   - mensaje: mínimo 10 caracteres
   Cada error se muestra al lado del campo con lenguaje claro
   (heurística de Nielsen: ayudar a reconocer y corregir errores).
------------------------------------------------------------ */
const formularioContacto = document.getElementById("formularioContacto");

if (formularioContacto) {
  // Expresión regular simple de email: algo + @ + algo + . + algo
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Muestra u oculta el mensaje de error de un campo puntual
  const marcarCampo = (campo, idError, hayError) => {
    const mensajeError = document.getElementById(idError);
    campo.classList.toggle("campo-invalido", hayError);
    mensajeError.style.display = hayError ? "block" : "none";
  };

  formularioContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const servicio = document.getElementById("servicio");
    const mensaje = document.getElementById("mensaje");
    const exito = document.getElementById("mensajeExito");

    // trim() elimina espacios: " " no cuenta como nombre válido
    const errorNombre = nombre.value.trim().length < 2;
    const errorEmail = !patronEmail.test(email.value.trim());
    const errorServicio = servicio.value === "";
    const errorMensaje = mensaje.value.trim().length < 10;

    marcarCampo(nombre, "errorNombre", errorNombre);
    marcarCampo(email, "errorEmail", errorEmail);
    marcarCampo(servicio, "errorServicio", errorServicio);
    marcarCampo(mensaje, "errorMensaje", errorMensaje);

    const hayErrores = errorNombre || errorEmail || errorServicio || errorMensaje;

    if (!hayErrores) {
      exito.style.display = "block";
      exito.textContent = `¡Gracias, ${nombre.value.trim()}! Recibimos tu consulta sobre "${servicio.options[servicio.selectedIndex].text}". Te respondemos por correo dentro de las 48 h.`;
      formularioContacto.reset();
      // El mensaje de éxito se oculta solo a los 8 segundos
      setTimeout(() => { exito.style.display = "none"; }, 8000);
    } else {
      exito.style.display = "none";
    }
  });
}
