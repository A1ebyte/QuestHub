import "./Ofertas.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicioOfertas from "../../servicios/Axios/ServicioOfertas.ts";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.ts";
import { Filtros } from "../../modelos/Pageable.ts";

import OfertasLista from "../../componentes/OfertaLista/OfertasLista.tsx";
import PanelFiltros from "../../componentes/PanelFiltros/PanelFiltros.tsx";
import Paginator from "../../componentes/Paginator/Paginator.tsx";

import {
  DEFAULT_DIRECTION,
  DEFAULT_SORT_BY,
  Direction,
  SortBy,
  sortLabels,
} from "../../const/sort.ts";
import { Tienda } from "../../modelos/Tienda.ts";
import ServicioTienda from "../../servicios/Axios/ServicioTienda.ts";
import { enviarNoti, typeToast } from "../../toolkit/notificacionToast.jsx";
import { HEART, INFO, SKULL } from "../../const/iconosToast.tsx";

function esNumValido(numero: string | undefined): number | undefined {
  let value = numero?.trim();
  if (value === null || value === undefined || isNaN(Number(value)))
    return undefined;
  return Number(value);
}

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtrosIniciales: Filtros = {
    titulo: searchParams.get("titulo") || undefined,
    minPrecio: esNumValido(searchParams.get("minPrecio") as string),
    maxPrecio: esNumValido(searchParams.get("maxPrecio") as string),
    minAhorro: esNumValido(searchParams.get("minAhorro") as string),
    tiers: searchParams.getAll("tiers"),
    reviews: searchParams.getAll("reviews"),
    inicioOferta: searchParams.get("inicioOferta") || undefined,
    tiendaIds: searchParams.getAll("tiendaIds").map(esNumValido).filter((v): v is number => v !== undefined),
  };

  const sortByInicial = (searchParams.get("sortBy") as SortBy) || DEFAULT_SORT_BY;
  const directionInicial = (searchParams.get("direction") as Direction) || DEFAULT_DIRECTION;

  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [sortBy, setSortBy] = useState<SortBy>(sortByInicial);
  const [direction, setDirection] = useState<Direction>(directionInicial);
  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const initialPage = Number(searchParams.get("page")) || 1;
  const [pagina, setPagina] = useState(initialPage);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const [tiendas, setTiendas] = useState<Tienda[]>([]);

  const [maxPrecio, setMaxPrecio] = useState<number | undefined>(undefined);

  const updateFiltros = (nuevo: Filtros) => {
    setFiltros(nuevo);
    setPagina(1);
  };

  useEffect(() => {
    ServicioTienda.getAllTiendas()
      .then((res) => setTiendas(res.data))
      .catch((err) => {
        enviarNoti(typeToast.ERROR, "Error cargando precio máximo:", err.response.data.message);
        console.error(err.response.data.message, err);
      });

    ServicioOfertas.getMaxPrecioOferta()
      .then((res) => setMaxPrecio(res.data))
      .catch((err) => {
        enviarNoti(typeToast.ERROR, "Error cargando precio máximo:", err.response.data.message);
        console.error(err.response.data.message, err);
      });
  }, []);

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

        const params: Record<string, string | string[]> = {
          page: pagina.toString(),
          sortBy,
          direction,
        };

        Object.entries(filtros).forEach(([key, value]) => {
          if (value === undefined || value === "" || value === null) return;
          if (Array.isArray(value) && value.length === 0) return;
          params[key] = Array.isArray(value)
            ? value.map((v) => v.toString())
            : value.toString();
        });

        setSearchParams(params, { replace: true });
      })
      .catch((err) => {
        enviarNoti(typeToast.WARN, "Error cargando ofertas:",err.response.data.message);
        console.error(err.response.data.message, err);
      });
  }, [pagina, filtros, sortBy, direction]);

  return (
    <div className="InicioContenedor">
      <div className="JuegosMainLayout">
        {showPanel && (
          <aside className="OverlayPanel">
            <PanelFiltros
              filtros={filtros}
              tiendas={tiendas}
              maxPrecio={maxPrecio}
              setFiltros={updateFiltros}
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
                  onClick={() => setDirection(Direction.ASC)}
                  style={{ opacity: direction === Direction.ASC ? 1 : 0.5 }}
                >
                  ▲
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setDirection(Direction.DESC)}
                  style={{ opacity: direction === Direction.DESC ? 1 : 0.5 }}
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
            onPageChange={(p) => {
              setPagina(p);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Ofertas;
