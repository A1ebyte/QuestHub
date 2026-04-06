import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameLista from "../componentes/GameLista";
import PanelFiltros from "../componentes/PanelFiltros";
import Orden from "../toolkit/orden";
import Filtro from "../toolkit/filtrar";
import "../estilos/Paginas/Juegos.css";

function Juegos({ juegos = [], generos = [], plataformas = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ESTADOS NUEVOS: Control de paneles y dropdowns
  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const initialFiltros = {
    generos: searchParams.get("generos")?.split(",") || [],
    consolas: searchParams.get("consolas")?.split(",") || [],
    rating: Number(searchParams.get("rating")) || 0,
    recomendados: searchParams.get("recomendados") === "true" || false,
    sort: searchParams.get("sort") || "fecha",
    order: searchParams.get("order") || "desc",
  };

  const [filtros, setFiltros] = useState(initialFiltros);
  const [horizontal, setHorizontal] = useState(false);
  const [filtrados, setFiltrados] = useState([]);

  // Diccionario para mostrar nombres bonitos en el botón de orden
  const sortLabels = {
    fecha: "Fecha estreno",
    rating: "Rating",
    nombre: "Nombre",
    precio: "Precio"
  };

  // Sincroniza URL
  useEffect(() => {
    const params = {};
    if (filtros.generos.length > 0) params.generos = filtros.generos.join(",");
    if (filtros.consolas.length > 0)
      params.consolas = filtros.consolas.join(",");
    if (filtros.rating > 0) params.rating = filtros.rating;
    if (filtros.recomendados) params.recomendados = true;
    if (filtros.sort) params.sort = filtros.sort;
    if (filtros.order) params.order = filtros.order;

    setSearchParams(params);
  }, [filtros]);

  // Aplica filtros
  useEffect(() => {
    let data = [...juegos];

    if (filtros.consolas.length > 0) {
      data = Filtro.filtrarConsolas(data, filtros.consolas);
    }

    if (filtros.generos.length > 0) {
      data = Filtro.filtrarGenero(data, filtros.generos);
    }

    if (filtros.rating > 0) {
      data = data.filter((j) => j.rating >= filtros.rating);
    }

    if (filtros.recomendados) {
      data = Filtro.filtrarRecomendados(data);
    }

    // Ordenar
    data = Orden.ordenar(data, filtros.sort, filtros.order);

    setFiltrados(data);
  }, [juegos, filtros]);

  return (
    <div className="InicioContenedor">
      <div className="JuegosMainLayout">
        {/* 1. PANEL LATERAL (IZQUIERDA) */}
        {showPanel && (
          <aside className="OverlayPanel">
            <PanelFiltros
              filtros={filtros}
              setFiltros={setFiltros}
              generos={generos}
              plataformas={plataformas}
              onClose={() => setShowPanel(false)}
            />
          </aside>
        )}

        {/* 2. CONTENIDO (DERECHA) */}
        <div className="juegos-content">
          <div className="header-seccion-juegos">
            <h1 className="titulo-principal-pagina">Todos los juegos</h1>
            
            <div className="barra-controles-moderna">
              <button className={`pill-btn ${showPanel ? "active" : ""}`} onClick={() => setShowPanel(!showPanel)}>
                Filtros
              </button>

              <div className="custom-dropdown">
                <button className="pill-btn dropdown-trigger" onClick={() => setIsOpenSort(!isOpenSort)}>
                  {sortLabels[filtros.sort] || "..."}
                  <span className="arrow-icon"> {isOpenSort ? "▲" : "▼"}</span>
                </button>
                {isOpenSort && (
                  <ul className="dropdown-menu">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <li key={key} onClick={() => {
                        setFiltros({ ...filtros, sort: key });
                        setIsOpenSort(false);
                      }}>
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="order-direction-group">
                <button className={`icon-btn ${filtros.order === "desc" ? "active" : ""}`} onClick={() => setFiltros({ ...filtros, order: "desc" })}>▼</button>
                <button className={`icon-btn ${filtros.order === "asc" ? "active" : ""}`} onClick={() => setFiltros({ ...filtros, order: "asc" })}>▲</button>
              </div>
            </div>
          </div>

          <GameLista juegos={filtrados} horizontal={horizontal} />
        </div>
      </div>
    </div>
  );
}

export default Juegos;