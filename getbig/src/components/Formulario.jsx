import React, { useState, useEffect } from "react";
import "../styles/Formulario.css";

function Formulario({ 
  formData, 
  handleChange, 
  handleSubmit, 
  error, 
  setFormData,
  setRutinaSeleccionada,
  reiniciarFormulario
}) {
  const [rutinaSeleccionada, setLocalRutina] = useState("");

  const obtenerRutinasPosibles = (objetivo, tiempo, dias) => {
    const rutinas = {
      ganar_musculo: {
        "30_min": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": [] },
        "1_hora": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": ["PUSH PULL LEGS"] },
        "2_horas": { "3_dias": ["PUSH PULL LEGS"], "4_dias": ["UPPER LOWER"], "6_dias": ["PUSH PULL LEGS", "ARNOLD SPLIT"] },
      },
      perder_grasa: {
        "30_min": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": [] },
        "1_hora": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": ["PUSH PULL LEGS"] },
        "2_horas": { "3_dias": ["PUSH PULL LEGS"], "4_dias": ["UPPER LOWER"], "6_dias": ["PUSH PULL LEGS", "ARNOLD SPLIT"] },
      },
      mantener: {
        "30_min": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": [] },
        "1_hora": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": ["FULL BODY"] },
        "2_horas": { "3_dias": ["FULL BODY"], "4_dias": ["UPPER LOWER"], "6_dias": ["FULL BODY"] },
      },
    };
    return rutinas[objetivo]?.[tiempo]?.[dias] || [];
  };

  const rutinasPosibles = obtenerRutinasPosibles(
    formData.objetivo,
    formData.tiempoEntrenamiento,
    formData.diasSemana
  );

  const requiredFields = ["objetivo", "tiempoEntrenamiento", "diasSemana", "peso", "altura", "edad", "sexo"];
  const isFormValid = requiredFields.every(field => formData[field] && formData[field] !== "");

  useEffect(() => {
    if (rutinasPosibles.length === 1) {
      setLocalRutina(rutinasPosibles[0]);
      setRutinaSeleccionada(rutinasPosibles[0]);
    } else {
      setLocalRutina("");
      setRutinaSeleccionada("");
    }
  }, [rutinasPosibles]);

  const handleReiniciar = () => {
    setLocalRutina("");
    reiniciarFormulario();
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (rutinasPosibles.length === 1) {
      setRutinaSeleccionada(rutinasPosibles[0]);
    }
    handleSubmit(e);
  };

  return (
  <>
    <form className="formulario" onSubmit={handleFinalSubmit}>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="altura">Altura (cm)</label>
          <input
            type="number"
            id="altura"
            name="altura"
            placeholder="Ej: 175"
            value={formData.altura || ""}
            onChange={handleChange}
            min="100"
            max="250"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="peso">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            placeholder="Ej: 70"
            value={formData.peso || ""}
            onChange={handleChange}
            min="30"
            max="300"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label htmlFor="edad">Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            placeholder="Ej: 25"
            value={formData.edad || ""}
            onChange={handleChange}
            min="12"
            max="120"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="sexo">Sexo</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo || ""}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label htmlFor="objetivo">Objetivo</label>
          <select
            id="objetivo"
            name="objetivo"
            value={formData.objetivo || ""}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="ganar_musculo">Ganar músculo</option>
            <option value="perder_grasa">Perder grasa</option>
            <option value="mantener">Mantener</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="experiencia">Experiencia</label>
          <select
            id="experiencia"
            name="experiencia"
            value={formData.experiencia || ""}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label htmlFor="tiempoEntrenamiento">¿Cuántas horas quieres entrenar al día?</label>
          <select
            id="tiempoEntrenamiento"
            name="tiempoEntrenamiento"
            value={formData.tiempoEntrenamiento || ""}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="30_min">30 minutos</option>
            <option value="1_hora">1 hora</option>
            <option value="2_horas">2 horas</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="diasSemana">¿Cuántos días quieres entrenar a la semana?</label>
          <select
            id="diasSemana"
            name="diasSemana"
            value={formData.diasSemana || ""}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="3_dias">3 días</option>
            <option value="4_dias">4 días</option>
            <option value="6_dias">6 días</option>
          </select>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="button-container">
        <button 
          type="submit"
          className="submit-button"
          disabled={!isFormValid || rutinasPosibles.length === 0}
        >
          Generar mi plan personalizado
        </button>
      </div>
      </form>
    </>
  );
}

export default Formulario;
