import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Formulario.css";
import { obtenerRutinasPosibles } from "../utils/calcularRutina";
import { validarDatos } from "../utils/validaciones";
import { useRutinasPosibles } from "../utils/rutinas.js"; // ✅ Usamos el hook para obtener rutinas posibles

function Formulario() {
  const [formData, setFormData] = useState({
    altura: "",
    peso: "",
    edad: "",
    sexo: "",
    objetivo: "",
    experiencia: "",
    tiempoEntrenamiento: "",
    diasSemana: "",
  });

  const [error, setError] = useState(null);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const navigate = useNavigate();
  const rutinasPosibles = useRutinasPosibles(); // ✅ Obtenemos las rutinas desde la API

  useEffect(() => {
    console.log("📌 Rutinas posibles cargadas:", rutinasPosibles); // 🔍 Verificación en consola
  }, [rutinasPosibles]);

  // ✅ Definiendo correctamente `handleChange`
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(`📌 Cambio detectado - ${name}:`, value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.diasSemana || formData.diasSemana === "") {
      setError({ general: "Selecciona los días de entrenamiento antes de continuar." });
      return;
    }

    const resultadoValidacion = validarDatos(formData);
    if (!resultadoValidacion.success) {
      setError(resultadoValidacion.errores);
      return;
    }

    setError(null);

    if (!rutinasPosibles || rutinasPosibles.length === 0) {
      console.error("❌ `rutinasPosibles` aún no ha cargado datos en `handleFormSubmit()`");
      setError({ general: "No se pudo obtener las rutinas. Intenta nuevamente." });
      return;
    }

    // 🔥 Convertimos la edad y `diasSemana` a número antes de enviarla
    const datosProcesados = {
      ...formData,
      edad: parseInt(formData.edad, 10),
      diasSemana: parseInt(formData.diasSemana, 10),
    };

    const rutina = obtenerRutinasPosibles(
      datosProcesados.objetivo,
      datosProcesados.tiempoEntrenamiento,
      datosProcesados.diasSemana,
      rutinasPosibles
    );

    console.log("📌 Datos enviados para redirección:", { rutina, datosProcesados });

    if (rutina.length === 0) {
      setError({ general: "No hay rutina disponible con estos parámetros. Asegúrate de completar correctamente el formulario." });
      return;
    }

    setRutinaSeleccionada(rutina);
    console.log("✅ Redirigiendo a /rutina con datos:", { rutina, datosProcesados });

    // ✅ Asegurar que `state` realmente está pasando datos
    navigate("/rutina", { state: { rutina, formData: datosProcesados } });
  };

  return (
    <form className="formulario" onSubmit={handleFormSubmit}>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="altura">Altura (cm)</label>
          <input type="number" id="altura" name="altura" value={formData.altura} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="peso">Peso (kg)</label>
          <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} required />
        </div>
      </div>

      {/* Edad y Sexo */}
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="edad">Edad</label>
          <input type="number" id="edad" name="edad" value={formData.edad} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="sexo">Sexo</label>
          <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
      </div>

      {/* Objetivo y Experiencia */}
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="objetivo">Objetivo</label>
          <select id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="ganar_musculo">Ganar músculo</option>
            <option value="perder_grasa">Perder grasa</option>
            <option value="mantener">Mantener</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="experiencia">Experiencia</label>
          <select id="experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Tiempo y Días */}
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="tiempoEntrenamiento">Tiempo de entrenamiento</label>
          <select id="tiempoEntrenamiento" name="tiempoEntrenamiento" value={formData.tiempoEntrenamiento} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="30_min">30 minutos</option>
            <option value="1_hora">1 hora</option>
            <option value="2_horas">2 horas</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="diasSemana">Días de entrenamiento</label>
          <select id="diasSemana" name="diasSemana" value={formData.diasSemana} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="3">3 días</option>
            <option value="4">4 días</option>
            <option value="6">6 días</option>
          </select>
        </div>
      </div>

      {error && <p className="error-message">{Object.values(error).join(", ")}</p>}

      <div className="button-container">
        <button type="submit" className="submit-button" disabled={!rutinasPosibles.length}>
          Generar mi plan personalizado
        </button>
      </div>
    </form>
  );
}

export default Formulario;