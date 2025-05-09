import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import "../styles/Global.css";
import "../styles/CalendarioRutina.css";

// Datos separados (normalmente en archivos aparte)
const ejerciciosPorMusculo = {
  Pecho: ["Press banca plano", "Press inclinado", "Aperturas con mancuernas", "Flexiones"],
  Hombros: ["Press militar", "Elevaciones laterales", "Deltoides posterior", "Face pulls"],
  Tríceps: ["Fondos", "Extensiones en polea", "Press francés", "Fondos en banco"],
  Espalda: ["Dominadas", "Remo con barra", "Jalón al pecho", "Peso muerto"],
  Bíceps: ["Curl con barra", "Curl martillo", "Curl concentrado", "Curl en banco Scott"],
  Cuádriceps: ["Sentadillas", "Prensa", "Zancadas", "Extensiones de pierna"],
  Isquiotibiales: ["Peso muerto rumano", "Curl femoral", "Good mornings", "Hip thrust"],
  Gemelos: ["Elevaciones de talón", "Press de pantorrilla", "Saltos de cuerda"],
  Core: ["Plancha", "Russian twists", "Elevaciones de piernas", "Abdominales en rueda"]
};

const rutinas = {
  "PUSH PULL LEGS": {
    Lunes: "Push: Pecho, Hombros, Tríceps",
    Martes: "Pull: Espalda, Bíceps, Core",
    Miércoles: "Piernas: Cuádriceps, Isquiotibiales, Gemelos",
    Jueves: "Push: Pecho, Hombros, Tríceps",
    Viernes: "Pull: Espalda, Bíceps, Core",
    Sábado: "Piernas: Cuádriceps, Isquiotibiales, Gemelos",
    Domingo: "Descanso activo (cardio ligero o yoga)"
  },
  "ARNOLD SPLIT": {
    Lunes: "Pecho y Espalda",
    Martes: "Hombros y Brazos",
    Miércoles: "Piernas y Core",
    Jueves: "Pecho y Espalda",
    Viernes: "Hombros y Brazos",
    Sábado: "Piernas y Core",
    Domingo: "Descanso"
  },
  "UPPER LOWER": {
    Lunes: "Upper: Pecho, Espalda, Hombros, Brazos",
    Martes: "Lower: Piernas completas, Core",
    Miércoles: "Descanso o Cardio",
    Jueves: "Upper: Pecho, Espalda, Hombros, Brazos",
    Viernes: "Lower: Piernas completas, Core",
    Sábado: "Descanso o Cardio",
    Domingo: "Descanso"
  },
  "FULL BODY": {
    Lunes: "Full Body: Compuesto (Pecho, Espalda, Piernas)",
    Martes: "Cardio o Descanso",
    Miércoles: "Full Body: Aislado (Hombros, Brazos, Core)",
    Jueves: "Cardio o Descanso",
    Viernes: "Full Body: Compuesto (Pecho, Espalda, Piernas)",
    Sábado: "Cardio o Descanso",
    Domingo: "Descanso activo"
  }
};

const rutinasPosibles = {
  ganar_musculo: {
    "30_min": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "" },
    "1_hora": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "PUSH PULL LEGS" },
    "2_horas": { "3_dias": "PUSH PULL LEGS", "4_dias": "UPPER LOWER", "6_dias": "ARNOLD SPLIT" }
  },
  perder_grasa: {
    "30_min": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "" },
    "1_hora": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "PUSH PULL LEGS" },
    "2_horas": { "3_dias": "UPPER LOWER", "4_dias": "PUSH PULL LEGS", "6_dias": "ARNOLD SPLIT" }
  },
  mantener: {
    "30_min": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "" },
    "1_hora": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "FULL BODY" },
    "2_horas": { "3_dias": "FULL BODY", "4_dias": "UPPER LOWER", "6_dias": "UPPER LOWER" }
  }
};

const traducciones = {
  es: {
    descanso: "Descanso",
    series: "Series",
    ejercicios: "ejercicios",
    actualizado: "Actualizado",
    dias_semana: "Días/semana",
    duracion: "Duración",
    objetivo: "Objetivo",
    nivel: "Nivel",
    masa: "Masa",
    definicion: "Definición",
    mantenimiento: "Mantenimiento"
  },
  en: {
    descanso: "Rest",
    series: "Sets",
    ejercicios: "exercises",
    actualizado: "Updated",
    dias_semana: "Days/week",
    duracion: "Duration",
    objetivo: "Goal",
    nivel: "Level",
    masa: "Mass",
    definicion: "Definition",
    mantenimiento: "Maintenance"
  }
};

// Componente memoizado para días de la semana
const DiaSemana = React.memo(({ dia, descripcion, esDescanso, esSeleccionado, onClick }) => {
  const tipoDia = descripcion.split(":")[0] || traducciones.es.descanso;
  
  return (
    <motion.div
      className={`dia-semana ${esDescanso ? "dia-descanso" : esSeleccionado ? "dia-seleccionado" : "dia-activo"}`}
      onClick={!esDescanso ? onClick : undefined}
      onKeyDown={(e) => !esDescanso && e.key === "Enter" && onClick()}
      role="button"
      tabIndex={!esDescanso ? "0" : undefined}
      aria-label={`${dia}: ${descripcion}`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={!esDescanso ? { scale: 1.05 } : {}}
      whileTap={!esDescanso ? { scale: 0.98 } : {}}
    >
      <div className="dia-nombre">{dia.substring(0, 3)}</div>
      <div className="dia-descripcion">{tipoDia}</div>
    </motion.div>
  );
});

DiaSemana.propTypes = {
  dia: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  esDescanso: PropTypes.bool.isRequired,
  esSeleccionado: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

// Hook personalizado para determinar la rutina
function useRutinaSeleccionada(formData, rutinaSeleccionada) {
  return useMemo(() => {
    if (rutinaSeleccionada && rutinas[rutinaSeleccionada]) {
      return rutinaSeleccionada;
    }
    return rutinasPosibles[formData.objetivo]?.[formData.tiempoEntrenamiento]?.[formData.diasSemana] || "FULL BODY";
  }, [formData, rutinaSeleccionada]);
}

// Hook personalizado para ejercicios del día
function useEjerciciosDelDia(diaSeleccionado, diasRutina) {
  const generarEjercicios = useCallback((detalle) => {
    const grupos = detalle.split(":")[1]?.split(",").map(g => g.trim()) || [];
    
    return grupos.flatMap(grupo => {
      const clave = Object.keys(ejerciciosPorMusculo).find(k => 
        grupo.toLowerCase().includes(k.toLowerCase())
      );
      return clave ? ejerciciosPorMusculo[clave].slice(0, 4) : [];
    });
  }, []);

  return useMemo(() => {
    if (diaSeleccionado === null) return [];
    const descripcion = diasRutina[diaSeleccionado]?.[1];
    return descripcion ? generarEjercicios(descripcion) : [];
  }, [diaSeleccionado, diasRutina, generarEjercicios]);
}

function CalendarioRutina({ formData = {}, rutinaSeleccionada, language = 'es' }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");
  const t = traducciones[language] || traducciones.es;

  // Valores por defecto para formData
  const defaultFormData = useMemo(() => ({
    objetivo: "ganar_musculo",
    tiempoEntrenamiento: "1_hora",
    diasSemana: "3_dias",
    experiencia: "intermedio",
    ...formData
  }), [formData]);

  // Determinar rutina usando hook personalizado
  const determinarRutinaFinal = useRutinaSeleccionada(defaultFormData, rutinaSeleccionada);
  const rutina = rutinas[determinarRutinaFinal] || rutinas["FULL BODY"];
  const diasRutina = Object.entries(rutina);

  // Filtrar días de entrenamiento (excluyendo descanso)
  const diasEntrenamiento = useMemo(() => 
    diasRutina
      .map(([dia, descripcion], index) => ({ dia, descripcion, index }))
      .filter(({ descripcion }) => !descripcion.toLowerCase().includes(t.descanso.toLowerCase()))
  , [diasRutina, t.descanso]);

  // Obtener ejercicios del día usando hook personalizado
  const ejerciciosActuales = useEjerciciosDelDia(diaSeleccionado, diasRutina);

  // Seleccionar primer día de entrenamiento al cargar
  useEffect(() => {
    if (diasEntrenamiento.length > 0 && diaSeleccionado === null) {
      setDiaSeleccionado(diasEntrenamiento[0].index);
    }
  }, [diasEntrenamiento, diaSeleccionado]);

  // Persistir rutina en localStorage con manejo de errores
  useEffect(() => {
    try {
      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleDateString());
      localStorage.setItem('ultimaRutina', JSON.stringify({
        rutina: determinarRutinaFinal,
        fecha: ahora.toISOString(),
        datos: defaultFormData
      }));
    } catch (error) {
      console.error("Error al guardar rutina:", error);
    }
  }, [determinarRutinaFinal, defaultFormData]);

  // Manejar cambio de día con useCallback
  const handleClickDia = useCallback((index) => {
    setDiaSeleccionado(index);
  }, []);

  // Función para obtener series/reps
  const getSeriesReps = useCallback((ejercicioIndex) => {
    const { experiencia } = defaultFormData;
    const esCompuesto = ejercicioIndex === 0; // Primer ejercicio es compuesto
    
    if (experiencia === "principiante") {
      return `3${t.series === "Series" ? "x" : " sets of "}${esCompuesto ? "8-10" : "10-12"}`;
    } else if (experiencia === "avanzado") {
      return `4${t.series === "Series" ? "x" : " sets of "}${esCompuesto ? "6-8" : "8-10"}`;
    }
    return `4${t.series === "Series" ? "x" : " sets of "}${esCompuesto ? "8-10" : "10-12"}`; // Intermedio por defecto
  }, [defaultFormData.experiencia, t.series]);

  // Info del día actual
  const [diaActual, descripcionActual] = diaSeleccionado !== null ? diasRutina[diaSeleccionado] : [];

  return (
    <div className="calendario-rutina">
      {/* Encabezado con estadísticas */}
      <div className="resumen-stats">
        <motion.div 
          className="stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-label">{t.dias_semana}</div>
          <div className="stat-value">{diasEntrenamiento.length}</div>
        </motion.div>
        
        <motion.div 
          className="stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-label">{t.duracion}</div>
          <div className="stat-value">
            {defaultFormData.tiempoEntrenamiento.replace("_", " ")}
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-label">{t.objetivo}</div>
          <div className="stat-value">
            {defaultFormData.objetivo === "ganar_musculo" ? t.masa : 
             defaultFormData.objetivo === "perder_grasa" ? t.definicion : t.mantenimiento}
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-label">{t.nivel}</div>
          <div className="stat-value">
            {defaultFormData.experiencia.charAt(0).toUpperCase() + 
             defaultFormData.experiencia.slice(1)}
          </div>
        </motion.div>
      </div>

      {/* Selector de días */}
      <h4 className="seccion-titulo">Distribución semanal</h4>
      <div className="dias-semana">
        {diasRutina.map(([dia, descripcion], index) => {
          const esDescanso = descripcion.toLowerCase().includes(t.descanso.toLowerCase());
          const esSeleccionado = diaSeleccionado === index;
          
          return (
            <DiaSemana
              key={dia}
              dia={dia}
              descripcion={descripcion}
              esDescanso={esDescanso}
              esSeleccionado={esSeleccionado}
              onClick={() => handleClickDia(index)}
            />
          );
        })}
      </div>

      {/* Detalle del día seleccionado */}
      {diaActual && (
        <motion.div 
          className="rutina-detalle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-labelledby="dia-actual-heading"
        >
          <div className="dia-header">
            <h3 id="dia-actual-heading">
              {diaActual}: <span>{descripcionActual.split(":")[0]}</span>
            </h3>
            <div className="meta-info">
              <span className="ejercicios-count">
                {ejerciciosActuales.length} {t.ejercicios}
              </span>
              <span className="ultima-actualizacion">
                {t.actualizado}: {ultimaActualizacion}
              </span>
            </div>
          </div>

          <ul className="ejercicios-lista">
            {ejerciciosActuales.map((ejercicio, index) => {
              const grupoMuscular = Object.keys(ejerciciosPorMusculo).find(musculo =>
                ejerciciosPorMusculo[musculo].includes(ejercicio)
              );
              
              return (
                <motion.li
                  key={`${diaActual}-${ejercicio}`}
                  className="ejercicio-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="ejercicio-info">
                    <div className="ejercicio-nombre">{ejercicio}</div>
                    {grupoMuscular && (
                      <div className="ejercicio-musculo" title={`Grupo muscular: ${grupoMuscular}`}>
                        {grupoMuscular}
                      </div>
                    )}
                  </div>
                  <div className="ejercicio-series">
                    {getSeriesReps(index)}
                  </div>
                  <button 
                    className="info-button"
                    aria-label={`Detalles de ${ejercicio}`}
                  >
                    i
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

CalendarioRutina.propTypes = {
  formData: PropTypes.shape({
    objetivo: PropTypes.oneOf(['ganar_musculo', 'perder_grasa', 'mantener']),
    tiempoEntrenamiento: PropTypes.oneOf(['30_min', '1_hora', '2_horas']),
    diasSemana: PropTypes.oneOf(['3_dias', '4_dias', '6_dias']),
    experiencia: PropTypes.oneOf(['principiante', 'intermedio', 'avanzado'])
  }),
  rutinaSeleccionada: PropTypes.oneOf(Object.keys(rutinas)),
  language: PropTypes.oneOf(['es', 'en'])
};

CalendarioRutina.defaultProps = {
  formData: {},
  language: 'es'
};

export default CalendarioRutina;