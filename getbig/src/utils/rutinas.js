/**
 * rutinas.js
 * 
 * Este archivo contiene las rutinas de entrenamiento predefinidas.
 * Cada rutina tiene asignados los grupos musculares que se trabajan en cada día de la semana.
 * Se usa en CalendarioRutina.jsx para seleccionar y mostrar la rutina correspondiente.
 */

import { useEffect, useState } from "react";

/**
 * Hook para obtener todas las rutinas desde la base de datos.
 * @returns {Array} - Lista de rutinas de entrenamiento.
 */
export function useRutinas() {
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/rutinas")
      .then(res => {
        if (!res.ok) throw new Error("❌ Error al obtener rutinas");
        return res.json();
      })
      .then(data => {
        console.log("✅ Rutinas cargadas:", data); // 🔍 Verificación en consola
        setRutinas(data);
      })
      .catch(err => console.error(err));
  }, []);

  return rutinas;
}

/**
 * Hook para obtener rutinas posibles desde la base de datos.
 * @returns {Array} - Lista de rutinas posibles según el objetivo, tiempo y días de entrenamiento.
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
      .catch(err => console.error(err));
  }, []);

  return rutinasPosibles;
}

/**
 * Función para seleccionar la rutina recomendada según el objetivo y los días de entrenamiento.
 * @param {string} objetivo - Objetivo de entrenamiento ("ganar_musculo", "perder_grasa", "mantener").
 * @param {number} dias - Número de días de entrenamiento por semana.
 * @returns {string} - Nombre de la rutina recomendada.
 */
export function obtenerRutina(objetivo, dias) {
  if (dias >= 5) return objetivo === "ganar_musculo" ? "PUSH PULL LEGS" : "ARNOLD SPLIT";
  if (dias === 4) return "UPPER LOWER";
  return "FULL BODY";
}