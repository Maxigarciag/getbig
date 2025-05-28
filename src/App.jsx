import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import CalendarioRutina from "./components/CalendarioRutina";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlanEntrenamiento from "./components/PlanEntrenamiento";
import Progreso from "./pages/Progreso";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => console.log("✅ Conexión exitosa:", response.data))
      .catch(error => console.error("❌ Error en la conexión:", error));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plan-entrenamiento" element={<PrivateRoute><PlanEntrenamiento /></PrivateRoute>} />
          <Route path="/rutina" element={<PrivateRoute><CalendarioRutina /></PrivateRoute>} />
          <Route path="/progreso" element={<PrivateRoute><Progreso /></PrivateRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;