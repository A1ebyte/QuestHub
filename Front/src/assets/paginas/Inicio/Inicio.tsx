import "./Inicio.css";
import OfertasLista from "../../componentes/OfertaLista/OfertasLista.tsx";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas.ts";
import { useState } from "react";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.ts";
import { Direction, SortBy } from "../../const/sort.ts";
import { FLECHA } from "../../const/iconos.tsx";
import { backCaido } from "../../servicios/Axios/http-axios.ts";

function Inicio() {
  const [ahorro, setAhorro] = useState<OfertaTarjetaMostrar[]>([]);
  const [tedencias, setTendecias] = useState<OfertaTarjetaMostrar[]>([]);
  const [recientes, setRecientes] = useState<OfertaTarjetaMostrar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ServicioOfertas.getAll({
        size: 6,
        sortBy: SortBy.RATING,
        direction: Direction.DESC,
      }),
      ServicioOfertas.getAll({
        size: 6,
        sortBy: SortBy.AHORRO,
        direction: Direction.DESC,
      }),
      ServicioOfertas.getAll({
        size: 6,
        sortBy: SortBy.RECIENTE,
        direction: Direction.DESC,
      }),
    ])
      .then(([resTendencias, resAhorro, resRecientes]) => {
        setTendecias(resTendencias.data.content);
        setAhorro(resAhorro.data.content);
        setRecientes(resRecientes.data.content);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
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
        <Link
          to={`/ofertas?sortBy=${SortBy.RATING}&direction=${Direction.DESC}`}
          className="titulo-seccion-link"
        >
          <h2 className="titulo-seccion">Ofertas del Momento</h2>
          {FLECHA}
        </Link>
        <p className="descripcion-seccion">
          Aquí te mostramos los juegos con mejor rating elegidos por nuestra
          comunidad.
        </p>
        <OfertasLista ofertas={loading||backCaido ? Array(6).fill({}) : tedencias} columnas={3} loaded={!loading} />
      </div>
      <div className="seccion">
        <Link
          to={`/ofertas?sortBy=${SortBy.AHORRO}&direction=${Direction.DESC}`}
          className="titulo-seccion-link"
        >
          <h2 className="titulo-seccion">Ofertas con Mayor Ahorro</h2>
          {FLECHA}
        </Link>
        <p className="descripcion-seccion">
          Aquí te mostramos los juegos con mejor rating elegidos por nuestra
          comunidad.
        </p>
        <OfertasLista ofertas={loading||backCaido ? Array(6).fill({}) : ahorro} columnas={3} loaded={!loading} />
      </div>
      <div className="seccion">
        <Link
          to={`/ofertas?sortBy=${SortBy.RECIENTE}&direction=${Direction.DESC}`}
          className="titulo-seccion-link"
        >
          <h2 className="titulo-seccion">Ofertas más Recientes</h2>
          {FLECHA}
        </Link>
        <p className="descripcion-seccion">
          Aquí te mostramos los juegos con mejor rating elegidos por nuestra
          comunidad.
        </p>
        <OfertasLista ofertas={loading||backCaido ? Array(6).fill({}) : recientes} columnas={3} loaded={!loading} />
      </div>
    </div>
  );
}

export default Inicio;
