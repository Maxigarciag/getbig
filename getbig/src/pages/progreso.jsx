import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Progreso.css";

function Progreso() {
  const [ejercicios, setEjercicios] = useState([]); // ✅ Inicializar como array vacío
  const [cargando, setCargando] = useState(true); // ✅ Estado de carga

  useEffect(() => {
    axios.get("/api/progreso")
      .then(response => {
        if (Array.isArray(response.data)) { // ✅ Validación de array
          setEjercicios(response.data);
        } else {
          console.error("❌ Error: Datos recibidos no son un array", response.data);
        }
        setCargando(false);
      })
      .catch(error => {
        console.error("❌ Error cargando datos:", error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <h2>🔄 Cargando progreso...</h2>; // ✅ Mensaje de carga
  }

  return (
    <div className="progreso-container">
      <h2>📈 Seguimiento de Progreso</h2>
      {ejercicios.length === 0 ? (
        <p>🚧 No hay registros aún. ¡Pronto podrás ver tu progreso aquí!</p>
      ) : (
        <table className="tabla-progreso">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Peso (kg)</th>
              <th>Repeticiones</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(ejercicios) && ejercicios.map((item, index) => ( // ✅ Validación antes de map()
              <tr key={index}>
                <td>{item.ejercicio}</td>
                <td>{item.peso} kg</td>
                <td>{item.repeticiones}</td>
                <td>{item.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Progreso;