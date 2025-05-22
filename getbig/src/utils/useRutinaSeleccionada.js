/**
 * useRutinaSeleccionada.js
 * 
 * Este hook personalizado determina la rutina de entrenamiento final del usuario
 * en función de los datos ingresados en el formulario y la rutina seleccionada.
 * Se usa en CalendarioRutina.jsx para definir qué rutina debe mostrarse.
 */

import { useMemo, useEffect } from "react";
import { useRutinasPosibles } from "../utils/rutinas.js";

export function useRutinaSeleccionada(formData, rutinaSeleccionada) {
  const rutinasPosibles = useRutinasPosibles(); 

  useEffect(() => {
    if (rutinasPosibles.length > 0) {
      console.log("🔍 Datos de rutinas posibles:", rutinasPosibles);
    }
  }, [rutinasPosibles]);

  return useMemo(() => {
    if (rutinaSeleccionada && rutinasPosibles.length > 0) {
      const rutinaEncontrada = rutinasPosibles.find(r => 
        r.objetivo === formData.objetivo &&
        r.tiempo === formData.tiempoEntrenamiento &&
        r.dias === formData.diasSemana
      );
      return rutinaEncontrada?.nombre || rutinaSeleccionada;
    }
    return "FULL BODY";
  }, [formData, rutinaSeleccionada, rutinasPosibles]);
}