import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicioOfertas from "../servicios/Axios/ServicioOfertas.ts";
import { OfertaTarjetaMostrar } from "../modelos/Ofertas.js";

import OfertasLista from "../componentes/OfertasLista.js";
import PanelFiltros from "../componentes/PanelFiltros.jsx";
import Paginator from "../componentes/Paginator.jsx";

import "../estilos/Paginas/Ofertas.css";

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  
  const initialPage = Number(searchParams.get("page")) || 1;
  const [pagina, setPagina] = useState(initialPage);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  // Diccionario para mostrar nombres
  const sortLabels = {
    fecha: "Fecha estreno",
    rating: "Rating",
    nombre: "Nombre",
    precio: "Precio"
  };

  useEffect(() => {
    setSearchParams({
      page: pagina.toString()
    });
  }, [pagina]);

  useEffect(() => {
    ServicioOfertas.getAll({
      page: pagina-1,
    })
      .then((res) => {
        setOfertas(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [pagina]);

  return (
    <div className="InicioContenedor">
      <div className="JuegosMainLayout">
        {/* 1. PANEL LATERAL (IZQUIERDA) */}
        {showPanel && (
          <aside className="OverlayPanel">
            <PanelFiltros
              filtros={""}
              setFiltros={""}
              generos={""}
              plataformas={""}
              onClose={() => setShowPanel(false)}
            />
          </aside>
        )}

        {/* 2. CONTENIDO (DERECHA) */}
        <div className="juegos-content">
          <div className="header-seccion-juegos">
            <h1 className="titulo-principal-pagina">Todos las ofertas</h1>
            
            <div className="barra-controles-moderna">
              <button className={`pill-btn ${showPanel ? "active" : ""}`} onClick={() => setShowPanel(!showPanel)}>
                Filtros
              </button>

              <div className="custom-dropdown">
                <button className="pill-btn dropdown-trigger" onClick={() => setIsOpenSort(!isOpenSort)}>
                  {sortLabels["Rating"] || "..."}
                  <span className="arrow-icon"> {isOpenSort ? "▲" : "▼"}</span>
                </button>
                {isOpenSort && (
                  <ul className="dropdown-menu">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <li key={key} onClick={() => {
                        //setFiltros({ ...filtros, sort: key });
                        setIsOpenSort(false);
                      }}>
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="order-direction-group">
                <button className={"icon-btn"} >▼</button>
                <button className={"icon-btn"} >▲</button>
              </div>
            </div>
          </div>

          <OfertasLista ofertas={ofertas}/>

          <Paginator
            totalPages={totalPages}
            currentPage={pagina}        
            onPageChange={(p) => setPagina(p)}
          />
        </div>
      </div>
    </div>
  );
}

export default Ofertas;