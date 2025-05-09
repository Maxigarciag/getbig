import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Content from "../components/Content";


function Home() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Content />
        <Footer />
      </div>
    </Router>
  );
}

export default Home;
