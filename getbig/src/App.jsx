import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react"; // ✅ Importa useEffect correctamente
import axios from "axios"; // ✅ Importa axios
import Home from "./pages/Home";
import Formulario from "./components/Formulario";
import CalendarioRutina from "./components/CalendarioRutina";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlanEntrenamiento from "./components/PlanEntrenamiento";
import Progreso from "./pages/Progreso"; // ✅ Importando Progreso.jsx
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos/1") // ✅ Prueba la conexión con API
      .then(response => console.log("✅ Conexión exitosa:", response.data))
      .catch(error => console.error("❌ Error en la conexión:", error));
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/plan-entrenamiento" element={<PlanEntrenamiento />} />
        <Route path="/rutina" element={<CalendarioRutina />} />
        <Route path="/progreso" element={<Progreso />} /> {/* ✅ Ruta añadida */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
