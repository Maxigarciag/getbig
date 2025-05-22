import { useMemo } from "react";

export const useEjerciciosAgrupados = (ejerciciosActuales) => {
  console.log("📌 Datos antes de agrupar ejercicios:", ejerciciosActuales);

  if (!Array.isArray(ejerciciosActuales) || ejerciciosActuales.length === 0) {
    console.warn("⚠ No hay ejercicios actuales para agrupar.");
    return {};
  }

  const agrupados = ejerciciosActuales.reduce((agrupados, ejercicio) => {
    const grupo = ejercicio.musculo_grupo?.toLowerCase().trim() || "Otros";

    if (!agrupados[grupo]) {
      agrupados[grupo] = [];
    }
    agrupados[grupo].push(ejercicio);
    return agrupados;
  }, {});

  console.log("✅ Ejercicios agrupados correctamente:", agrupados);
  return agrupados;
};