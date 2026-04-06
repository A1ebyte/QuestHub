import React from "react";
import "../estilos/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
<footer className="page-footer">
  <div className="footer-left">
    <p>©2026 QuestHub — All rights reserved</p>

    <div className="footer-links">
      <Link to="/contacto">Contacto</Link>
      <Link to="/privacidad">Privacidad</Link>
      <a href="mailto:info@tuempresa.com">Email</a>
    </div>
  </div>

  <Link to="/">
    <div className="footer-right">
      <img src="/Imagenes/Logo.png" alt="Logo" />
    </div>
  </Link>
</footer>
  );
}
export default Footer;
