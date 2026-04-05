import GameLista from "../componentes/GameLista";
import "../estilos//Paginas/Inicio.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Orden from "../toolkit/orden";
import Filtro from "../toolkit/filtrar";

function Inicio({ videojuegos = [] }) {
  /*es mejor pasarle los juegos y hacer filtros aqui */
  const rating = Orden.ordenar(videojuegos, "rating", Orden.SortOrder.DESC, 6);
  const nuevos = Orden.ordenar(videojuegos, "fecha", Orden.SortOrder.DESC, 6);
  const recomendados = Filtro.filtrarRecomendados(
    Orden.ordenar(videojuegos, "recomendacion", Orden.SortOrder.DESC, 6),
  );

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.25; // velocidad del parallax
      const bg = document.querySelector(".Bienvenida-bg");
      if (bg) bg.style.transform = `translateY(${offset}px) scale(1.2)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="InicioContenedor">
      <div className="Bienvenida">
        <div className="Bienvenida-bg"></div>

        <div className="Bienvenida-contenido">
          <h1>Bienvenido a Quest-Hub</h1>
          <p>
            Aquí encontrarás las últimas novedades y recomendaciones de
            videojuegos.
          </p>
        </div>
      </div>
      <div className="seccion">
        <Link to="/" className="titulo-seccion-link">
          <h2 className="titulo-seccion">Tendencias</h2>
          <svg
            className="titulo-icono"
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="none" />
            <path
              d="M19 12L31 24L19 36"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <p className="descripcion-seccion">
          Aquí te mostramos los juegos con mejor rating elegidos por nuestra
          comunidad.
        </p>
        <GameLista juegos={rating} columnas={3} />
      </div>
      <div className="seccion">
        <Link to="/" className="titulo-seccion-link">
          <h2 className="titulo-seccion">Tendencias</h2>
          <svg
            className="titulo-icono"
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="none" />
            <path
              d="M19 12L31 24L19 36"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>{" "}
        <p className="descripcion-seccion">
          Aquí te mostramos los ultimos lanzamientos del momento.
        </p>
        <GameLista juegos={nuevos} columnas={3} />
      </div>
      <div className="seccion">
        <Link to="/" className="titulo-seccion-link">
          <h2 className="titulo-seccion">Tendencias</h2>
          <svg
            className="titulo-icono"
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="none" />
            <path
              d="M19 12L31 24L19 36"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>{" "}
        <p className="descripcion-seccion">
          Aquí te mostramos los juegos que te recomendamos jugar.
        </p>
        <GameLista juegos={recomendados} columnas={3} />
      </div>
    </div>
  );
}

export default Inicio;
