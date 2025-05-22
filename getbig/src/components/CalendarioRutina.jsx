import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import ResumenStats from "./ResumenStats.jsx";
import ListaDias from "./ListaDias.jsx";
import EjercicioGrupo from "./EjercicioGrupo.jsx";
import InfoEjercicioCard from "./InfoEjercicioCard.jsx";
import { obtenerRutina } from "../utils/rutinas.js";
import { traducciones } from "../utils/traducciones.js";
import { useEjerciciosDelDia } from "../utils/useEjerciciosDelDia.js";
import { useEjerciciosAgrupados } from "../utils/useEjerciciosAgrupados.js";
import { obtenerFeedback, evaluarProgreso, generarPreguntaInteractiva } from "../utils/generarFeedback.js";
import "../styles/CalendarioRutina.css";

function CalendarioRutina() {
  const location = useLocation();
  const state = location.state || {}; 

  const formData = state.formData || {};  
  const rutinaSeleccionada = Array.isArray(state.rutina) && state.rutina.length > 0 ? state.rutina : []; 

  console.log("📌 Datos recibidos en /rutina:", { formData, rutinaSeleccionada });

  if (Object.keys(formData).length === 0 || rutinaSeleccionada.length === 0) {
    return <p className="error-message">No se ha generado una rutina válida. Por favor, completa el formulario.</p>;
  }

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [semanaActual, setSemanaActual] = useState(() => parseInt(localStorage.getItem("semanaActual")) || 1);

  const language = "es";
  const t = traducciones[language] || traducciones.es;

  console.log("📌 Rutina seleccionada antes de obtener datos:", rutinaSeleccionada);
  const rutina = rutinaSeleccionada.length > 0 ? obtenerRutina(formData)[rutinaSeleccionada[0]?.rutina_id] || {} : {};
  console.log("✅ Rutina obtenida correctamente:", rutina);

  const diasRutina = Object.entries(rutina || {});

  const ejerciciosDelDia = useEjerciciosDelDia(diaSeleccionado, diasRutina, formData.experiencia);
  const ejerciciosAgrupados = useEjerciciosAgrupados(ejerciciosDelDia);

  useEffect(() => {
    localStorage.setItem("semanaActual", semanaActual);
  }, [semanaActual]);

  useEffect(() => {
    if (diasRutina.length > 0 && diaSeleccionado === null) {
      setDiaSeleccionado(0);
    }
  }, [diasRutina, diaSeleccionado]);

  const handleClickDia = useCallback((index) => {
    setDiaSeleccionado(index);
  }, []);

  return (
    <div className="calendario-rutina">
      <ResumenStats formData={formData} t={t} diasEntrenamiento={diasRutina.length} />
      <ListaDias diasRutina={diasRutina} t={t} diaSeleccionado={diaSeleccionado} handleClickDia={handleClickDia} />

      {diaSeleccionado !== null && Object.keys(ejerciciosAgrupados).length > 0 ? (
        <motion.div className="rutina-detalle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EjercicioGrupo ejerciciosAgrupados={ejerciciosAgrupados} />
        </motion.div>
      ) : (
        <p className="error-message">No hay ejercicios disponibles para esta rutina.</p>
      )}
    </div>
  );
}

export default CalendarioRutina;