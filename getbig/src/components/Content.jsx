import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/about";
import Contact from "../pages/contact";
import Rutina from "../components/Rutina";

function Content() {
  return (
    <div className="content">
      <Routes>              
        <Route path="/about" element={<About />} />
        <Route path="/rutina" element={<Rutina />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default Content;