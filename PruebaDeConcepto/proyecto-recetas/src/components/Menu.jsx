import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <nav className="imperial-nav">
      <div className="nav-logo">
        <Link to="/">
          <span className="gear-icon">⚙️</span>
          RECETAS IMPERIALES
        </Link>
      </div>

      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/pokemon" className="nav-link">
            Ver Pikachu
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
