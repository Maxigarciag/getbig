/**
 * calcularRutina.js
 * 
 * Este archivo obtiene las rutinas posibles desde la API en lugar de un archivo estático.
 * Se usa en CalendarioRutina.jsx para seleccionar y asignar una rutina de entrenamiento.
 */

import { useEffect, useState } from "react";

/**
 * Hook para obtener rutinas posibles desde la base de datos.
 * @returns {Array} - Lista de rutinas posibles según el objetivo, tiempo y días.
 */
export function useRutinasPosibles() {
  const [rutinasPosibles, setRutinasPosibles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/rutinas-posibles")
      .then(res => {
        if (!res.ok) throw new Error("❌ Error al obtener rutinas posibles");
        return res.json();
      })
      .then(data => {
        console.log("✅ Rutinas posibles cargadas:", data); // 🔍 Verificación en consola
        setRutinasPosibles(data);
      })
      .catch(err => console.error("❌ Error en `useRutinasPosibles()`: ", err));
  }, []);

  return rutinasPosibles;
}

/**
 * Obtiene las rutinas según el objetivo, tiempo disponible y días.
 * @param {string} objetivo - Objetivo de entrenamiento ("ganar_musculo", "perder_grasa", "mantener").
 * @param {string} tiempo - Tiempo dedicado al entrenamiento ("30_min", "1_hora", "2_horas").
 * @param {string} dias - Número de días de entrenamiento por semana.
 * @param {Array} rutinasPosibles - Lista de rutinas posibles obtenidas de la API.
 * @returns {Array} - Lista de rutinas posibles según la selección.
 */
export const obtenerRutinasPosibles = (objetivo, tiempo, dias, rutinasPosibles) => {
  console.log("🔍 Datos recibidos para filtrar:", { objetivo, tiempo, dias, rutinasPosibles });

  const rutinasFiltradas = rutinasPosibles.filter(rutina =>
    rutina.objetivo === objetivo &&
    rutina.tiempo === tiempo &&
    rutina.dias === parseInt(dias, 10) // 🔥 Asegura que `dias` es un número
  );

  console.log("✅ Rutinas filtradas:", rutinasFiltradas);

  return rutinasFiltradas;
};

/**
 * Selecciona la rutina recomendada según el objetivo y los días de entrenamiento.
 * @param {string} objetivo - Objetivo de entrenamiento ("ganar_musculo", "perder_grasa", "mantener").
 * @param {number} dias - Número de días de entrenamiento por semana.
 * @returns {string} - Nombre de la rutina recomendada.
 */
export const seleccionarRutina = (objetivo, dias) => {
  if (dias >= 5) return objetivo === "ganar_musculo" ? "PUSH PULL LEGS" : "ARNOLD SPLIT";
  if (dias === 4) return "UPPER LOWER";
  return "FULL BODY";
};