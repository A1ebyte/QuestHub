import "./Ofertas.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicioOfertas from "../../servicios/Axios/ServicioOfertas.ts";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.ts";
import { Filtros } from "../../modelos/Pageable.ts";

import OfertasLista from "../../componentes/OfertaLista/OfertasLista.tsx";
import PanelFiltros from "../../componentes/PanelFiltros/PanelFiltros.tsx";
import Paginator from "../../componentes/Paginator/Paginator.tsx";

import { TierID } from "../../const/tiers.ts";
import {
  DEFAULT_DIRECTION,
  DEFAULT_SORT_BY,
  Direction,
  SortBy,
  sortLabels,
} from "../../const/sort.ts";

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtrosIniciales: Filtros = {
    titulo: searchParams.get("titulo") || undefined,
    minPrecio: searchParams.get("minPrecio")
      ? Number(searchParams.get("minPrecio"))
      : undefined,
    maxPrecio: searchParams.get("maxPrecio")
      ? Number(searchParams.get("maxPrecio"))
      : undefined,
    minAhorro: searchParams.get("minAhorro")
      ? Number(searchParams.get("minAhorro"))
      : undefined,
    tiers: (searchParams.getAll("tiers") as TierID[]) || undefined,
    minReviews: searchParams.get("minReviews")
      ? Number(searchParams.get("minReviews"))
      : undefined,
    inicioOferta: searchParams.get("inicioOferta") || undefined,
    tiendaIds: searchParams.getAll("tiendaIds").map(Number) || undefined,
  };
  const sortByInicial =
    (searchParams.get("sortBy") as SortBy) || DEFAULT_SORT_BY;
  const directionInicial =
    (searchParams.get("direction") as Direction) || DEFAULT_DIRECTION;

  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [sortBy, setSortBy] = useState<SortBy>(sortByInicial);
  const [direction, setDirection] = useState<Direction>(directionInicial);
  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const initialPage = Number(searchParams.get("page")) || 1;
  const [pagina, setPagina] = useState(initialPage);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  //revisar si poniendo valores malos en la url se rompe la pagina, por ejemplo poniendo letras en vez de numeros en los filtros numericos, o poniendo un valor que no existe en los filtros de tiers o tiendas
  useEffect(() => {
    const params: Record<string, string | string[]> = {
      page: pagina.toString(),
      sortBy,
      direction,
    };

    Object.entries(filtros).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) return;

      if (Array.isArray(value)) {
        params[key] = value.map((v) => v.toString());
      } else {
        params[key] = value.toString();
      }
    });

    setSearchParams(params, { replace: true });
  }, [pagina, filtros, sortBy, direction]);

  useEffect(() => {
    ServicioOfertas.getAll({
      page: pagina - 1,
      filtros,
      sortBy,
      direction,
    })
      .then((res) => {
        setOfertas(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [pagina, filtros, sortBy, direction]);

  return (
    <div className="InicioContenedor">
      <div className="JuegosMainLayout">
        {showPanel && (
          <aside className="OverlayPanel">
            <PanelFiltros
              filtros={filtros}
              setFiltros={setFiltros}
              onClose={() => setShowPanel(false)}
            />
          </aside>
        )}

        <div className="juegos-content">
          <div className="header-seccion-juegos">
            <h1 className="titulo-principal-pagina">Todas las ofertas</h1>

            <div className="barra-controles-moderna">
              <button
                className={`pill-btn ${showPanel ? "active" : ""}`}
                onClick={() => setShowPanel(!showPanel)}
              >
                Filtros
              </button>

              {/* Dropdown de ordenamiento */}
              <div className="custom-dropdown">
                <button
                  className="pill-btn dropdown-trigger"
                  onClick={() => setIsOpenSort(!isOpenSort)}
                >
                  {sortLabels[sortBy]}
                  <span className="arrow-icon">{isOpenSort ? "▲" : "▼"}</span>
                </button>

                {isOpenSort && (
                  <ul className="dropdown-menu">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <li
                        key={key}
                        onClick={() => {
                          setSortBy(key as SortBy);
                          setIsOpenSort(false);
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botones de dirección */}
              <div className="order-direction-group">
                <button
                  className="icon-btn"
                  onClick={() => setDirection(Direction.Asc)}
                  style={{ opacity: direction === Direction.Asc ? 1 : 0.5 }}
                >
                  ▲
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setDirection(Direction.Desc)}
                  style={{ opacity: direction === Direction.Desc ? 1 : 0.5 }}
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          <OfertasLista ofertas={ofertas} />

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
