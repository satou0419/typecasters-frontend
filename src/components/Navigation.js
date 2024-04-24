import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArchiveCard, GameCard } from "./Card"; // Import only the CardCreate component
import "./navigation.css";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <section>
      <nav className={`nav-bar ${menuOpen ? "menu-open" : ""}`}>
        <div className="nav-bar__logo">
          <img src="./assets/logo/logo_simple.webp" alt="Logo" />
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className={`menu ${menuOpen ? "open" : "close"}`}>
          <Link to="/login">About</Link>
        </div>
      </nav>
    </section>
  );
}
