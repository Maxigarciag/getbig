import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-and-text">
        <img src="../src/assets/logo-azul-osc.png" alt="App logo" width={40} height={40} className="app-logo" />
        <span className="app-name">Get Big</span>
      </div>
      <ul>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            <i className="fas fa-info-circle"></i>
            About
          </Link>
        </li>
        <li>
          <Link to="/Rutina">
            <i className="fas fa-dumbbell"></i>
            Rutina
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <i className="fas fa-envelope"></i>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;