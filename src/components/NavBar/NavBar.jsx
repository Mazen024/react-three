import React, { useState } from "react";
import "./NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="title">
        <img
          src="https://th.bing.com/th/id/R.2b5285cb635abd3338abd2eedb556695?rik=pTtGie4hhDVvCw&pid=ImgRaw&r=0"
          alt="Logo"
        />
      </div>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "menu-open" : ""}>
        <li>
          <a href="#home">Home</a>
        </li>

        <li>
          <a href="#contact">Contact</a>
        </li>

        <li>
          <a href="#login">LogIn</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
