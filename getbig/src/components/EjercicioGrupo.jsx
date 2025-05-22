import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import EjercicioItem from "./EjercicioItem.jsx";

/**
- EjercicioGrupo.jsx
- Muestra los grupos de ejercicios de la rutina seleccionada.
- Cada grupo puede expandirse para revelar los ejercicios dentro de él.
- Se usa dentro de CalendarioRutina.jsx para visualizar la rutina diaria.
*/

function EjercicioGrupo({ 
  ejerciciosAgrupados = {}, 
  gruposExpandidos = {}, 
  toggleGrupo = () => {}, // 🔥 Fallback seguro
  setEjercicioSeleccionado = () => {}, // 🔥 Evita `undefined`
  t = {} // 🔥 Fallback para evitar errores
}) {
  console.log("📌 Ejercicios agrupados recibidos:", ejerciciosAgrupados);

 if (!ejerciciosAgrupados || Object.keys(ejerciciosAgrupados).length === 0) {
  console.warn("⚠ No hay ejercicios disponibles para esta rutina.");
  return <p className="error-message">No hay ejercicios disponibles para esta rutina.</p>;
}

  return (
    <div className="grupos-ejercicios-container">
      {Object.entries(ejerciciosAgrupados).map(([grupo, ejercicios]) => (
        <div key={grupo} className="grupo-ejercicios">
          <motion.div
            className="grupo-header"
            onClick={() => toggleGrupo(grupo)}
            onKeyDown={(e) => e.key === "Enter" && toggleGrupo(grupo)}
            role="button"
            tabIndex="0"
            aria-expanded={!!gruposExpandidos[grupo]}
            aria-controls={`grupo-content-${grupo}`}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="grupo-titulo">
              {grupo}
              <motion.span
                animate={{ rotate: gruposExpandidos[grupo] ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flecha"
              >
                ▼
              </motion.span>
            </div>
            <div className="ejercicios-count">
              {ejercicios.length} {ejercicios.length === 1 ? "ejercicio" : "ejercicios"}
            </div>
          </motion.div>

          <AnimatePresence>
            {gruposExpandidos[grupo] && (
              <motion.div
                id={`grupo-content-${grupo}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grupo-contenido"
              >
                <ul className="ejercicios-lista">
                  {ejercicios.map((ejercicio, index) => (
                    <EjercicioItem
                      key={`${grupo}-${index}`}
                      ejercicio={ejercicio}
                      index={index}
                      t={t}
                      setEjercicioSeleccionado={setEjercicioSeleccionado}
                    />
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

EjercicioGrupo.propTypes = {
  ejerciciosAgrupados: PropTypes.object, // ✅ Ahora permite valores `undefined`
  gruposExpandidos: PropTypes.object, // 🔥 Evita errores si no se pasa el prop
  toggleGrupo: PropTypes.func, // 🔥 Evita `undefined`
  setEjercicioSeleccionado: PropTypes.func, // 🔥 Evita `undefined`
  t: PropTypes.object, // 🔥 Evita `undefined`
};

export default EjercicioGrupo;