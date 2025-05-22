import React, { useState } from "react"; 
import PropTypes from "prop-types";
import { motion } from "framer-motion";

function EjercicioItem({ ejercicio, index, t = {}, setEjercicioSeleccionado }) {
  const [isHovered, setIsHovered] = useState(false); 

  const getSeriesReps = (ejercicioIndex) => {
    const esCompuesto = ejercicioIndex === 0;
    const seriesLabel = t.series ? t.series === "Series" ? "x" : " sets of " : "x"; // ✅ Evita errores si `t.series` es `undefined`
    return `4${seriesLabel}${esCompuesto ? "8-10" : "10-12"}`;
  };

  console.log("✅ Renderizando ejercicio:", ejercicio);

  if (!ejercicio) {
    return <p className="error-message">No se encontró información para este ejercicio.</p>;
  }

  return (
    <motion.li
      className={`ejercicio-item ${isHovered ? "hovered" : ""}`} 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="ejercicio-info">
        <div className="ejercicio-nombre">{ejercicio}</div>
      </div>
      <div className="ejercicio-series">{getSeriesReps(index)}</div>
      <button
        className="info-button"
        aria-label={`Detalles de ${ejercicio}`}
        onClick={() => setEjercicioSeleccionado(ejercicio)}
      >
        i
      </button>
    </motion.li>
  );
}

EjercicioItem.propTypes = {
  ejercicio: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  t: PropTypes.object,
  setEjercicioSeleccionado: PropTypes.func.isRequired,
};

export default EjercicioItem;