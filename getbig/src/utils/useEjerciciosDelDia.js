import { useState, useEffect, useMemo, useCallback } from "react";

export function useEjerciciosDelDia(diaSeleccionado, diasRutina, experiencia = "intermedio") {
  const [ejerciciosPorMusculo, setEjerciciosPorMusculo] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/ejercicios")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Ejercicios cargados desde la API:", data);

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠ La API devolvió un array vacío o datos inválidos.");
          return;
        }

        const agrupados = {};
        data.forEach(ejercicio => {
          const grupoMuscular = ejercicio.musculo_grupo?.toLowerCase().trim();
          if (!grupoMuscular) return;
          if (!agrupados[grupoMuscular]) agrupados[grupoMuscular] = [];
          agrupados[grupoMuscular].push(ejercicio);
        });

        console.log("✅ Ejercicios agrupados por grupo muscular:", agrupados);
        setEjerciciosPorMusculo(agrupados);
      })
      .catch(err => console.error("❌ Error al obtener ejercicios:", err));
  }, []);

  return useMemo(() => {
    console.log("📌 Estado actual de `diasRutina`:", diasRutina);
    console.log("📌 Día seleccionado:", diaSeleccionado);

    if (diaSeleccionado === null || !diasRutina || diasRutina.length === 0) {
      console.warn("⚠ `diaSeleccionado` o `diasRutina` no están correctamente definidos.");
      return [];
    }

    const diaRutina = diasRutina[diaSeleccionado];
    if (!diaRutina || typeof diaRutina[1] !== "string" || diaRutina[1].trim() === "") {
      console.warn("⚠ `diasRutina[diaSeleccionado]` no tiene una descripción válida.");
      return [];
    }

    const descripcion = diaRutina[1].toLowerCase().trim();
    console.log("✅ Descripción del día antes de generar ejercicios:", descripcion);

    const grupos = descripcion.split(",").map(g => g.trim());
    const ejerciciosGenerados = grupos.flatMap(grupo => ejerciciosPorMusculo[grupo] || []);

    console.log("✅ Ejercicios generados para el día:", ejerciciosGenerados);

    return ejerciciosGenerados;
  }, [diaSeleccionado, diasRutina, ejerciciosPorMusculo]);
}