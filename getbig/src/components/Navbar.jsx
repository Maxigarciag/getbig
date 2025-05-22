import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css"; // Ajusta la ruta según sea necesario

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Agregar efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo-and-text">
        <img src="../src/assets/logo-azul-osc.png" alt="Get Big logo" className="app-logo" />
        <span className="app-name">Get Big</span>
      </div>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
            <i className="fas fa-info-circle"></i>
            <span>About</span>
          </Link>
        </li>
        <li>
          <Link to="/rutina" className={location.pathname === "/rutina" ? "active" : ""}>
            <i className="fas fa-dumbbell"></i>
            <span>Rutina</span>
          </Link>
        </li>
        <li>
          <Link to="/progreso" className={location.pathname === "/progreso" ? "active" : ""}> 
            <i className="fas fa-chart-line"></i> {/* ✅ Icono de progreso */}
            <span>Progreso</span>
          </Link>
        </li>
        <li>
          <Link to="/contacto" className={location.pathname === "/contacto" ? "active" : ""}> 
            <i className="fas fa-envelope"></i> 
            <span>Contacto</span> {/* ✅ Se mantiene la opción de contacto */}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
