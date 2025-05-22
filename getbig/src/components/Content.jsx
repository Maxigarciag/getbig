import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/about";
import Contact from "../pages/contact";
import PlanEntrenamiento from "../components/PlanEntrenamiento.jsx";
import Progreso from "../pages/progreso.jsx"; // ✅ Importando la nueva página

function Content() {
  return (
    <div className="content">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/plan-entrenamiento" element={<PlanEntrenamiento />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/progreso" element={<Progreso />} /> {/* ✅ Ruta añadida */}
      </Routes>
    </div>
  );
}

export default Content;