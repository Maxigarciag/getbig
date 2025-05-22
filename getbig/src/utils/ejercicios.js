/**
 * ejercicios.js
 * 
 * Este archivo contiene la lista de ejercicios organizados por grupo muscular.
 * Se usa en CalendarioRutina.jsx para asignar ejercicios a los días de entrenamiento.
 */

import { useEffect, useState } from "react";

export function useEjerciciosAgrupados() {
  const [ejerciciosAgrupados, setEjerciciosAgrupados] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/ejercicios")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Ejercicios cargados:", data); // 🔍 Verificación en consola
        const agrupados = {};
        data.forEach(ejercicio => {
          if (!agrupados[ejercicio.musculo_grupo]) {
            agrupados[ejercicio.musculo_grupo] = [];
          }
          agrupados[ejercicio.musculo_grupo].push(ejercicio.nombre);
        });
        setEjerciciosAgrupados(agrupados);
      })
      .catch(err => console.error("❌ Error al obtener ejercicios:", err));
  }, []);

  return ejerciciosAgrupados;
}