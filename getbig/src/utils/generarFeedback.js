/** 
 * generarFeedback.js 
 * Este archivo contiene funciones para generar recomendaciones y sugerencias 
 * basadas en la experiencia del usuario y su progreso en la rutina.
 */

export const obtenerFeedback = (experiencia) => {
  if (experiencia === "principiante") {
    return "Concéntrate en aprender la técnica antes de aumentar peso. La clave está en la ejecución correcta.";
  }
  if (experiencia === "intermedio") {
    return "Prueba aumentar la carga progresivamente cada semana. Mantén un buen control del movimiento.";
  }
  return "Experimenta con técnicas avanzadas como drop sets, superseries y tempos controlados.";
};

export const evaluarProgreso = (semana) => {
  if (semana >= 4) {
    return "Si sientes que no avanzas, prueba cambiar los ejercicios o aumentar la intensidad.";
  }
  return "Sigue progresando, la constancia es la clave para ver resultados.";
};

export const generarPreguntaInteractiva = () => {
  const preguntas = [
    "¿Te sientes cómodo con el peso que estás usando? Si no, prueba ajustarlo para maximizar tu progreso.",
    "¿Notas mejoras en tu resistencia y fuerza? Si no, prueba variar la intensidad.",
    "¿Cómo te sientes después de cada sesión de entrenamiento? Escucha tu cuerpo y ajusta según sea necesario."
  ];
  return preguntas[Math.floor(Math.random() * preguntas.length)];
};