import GameLista from "../componentes/GameLista";
import "../estilos//Paginas/Inicio.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Orden from "../toolkit/orden";
import Filtro from "../toolkit/filtrar";
import ServicioOfertas from "../servicios/Axios/ServicioOfertas";
import { useState } from "react";

function Inicio() {
    const [ahorro, setAhorro] = useState([]);
    const [tedencias, setTendecias] = useState([]);
    // const [recientes, setRecientes] = useState([]);
  useEffect(() => {
    ServicioOfertas.getAll({size: 6,sortBy: ["ofertaRating"],
      direction:["desc"]})
      .then((response) => {
        setTendecias(response.data.content);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

      ServicioOfertas.getAll({size: 6, sortBy: "ahorro"})
      .then((response) => {
        setAhorro(response.data.content);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
/* 
      ServicioOfertas.getAll()
      .then((response) => {
        setTendecias(response.data.content);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      }); */
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.25; // velocidad del parallax
      const bg = document.querySelector(".Bienvenida-bg");
      if (bg) bg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="InicioContenedor quitarPadding">
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
        <GameLista juegos={tedencias} columnas={3} />
      </div>
      <div className="seccion">
        <Link to="/" className="titulo-seccion-link">
          <h2 className="titulo-seccion">Mejores Ofertas</h2>
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
        <GameLista juegos={ahorro} columnas={3} />
      </div>
      <div className="seccion">
        <Link to="/" className="titulo-seccion-link">
          <h2 className="titulo-seccion">Oferta Recientes</h2>
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
        <GameLista juegos={ahorro} columnas={3} />
      </div>
    </div>
  );
}

export default Inicio;
