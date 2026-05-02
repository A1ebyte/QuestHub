import "./Ofertas.css";

import { motion } from "framer-motion";

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
  getLabelFromSort,
} from "../../const/sort.ts";
import { Tienda } from "../../modelos/Tienda.ts";
import ServicioTienda from "../../servicios/Axios/ServicioTienda.ts";
import { FILTER } from "../../const/iconos.tsx";
import { msjsOfertas } from "../../const/mensajesOfertas.ts";
import { backCaido } from "../../servicios/Axios/http-axios.ts";

function esNumValido(numero: string | undefined): number | undefined {
  let value = numero?.trim();
  if (value === null || value === undefined || isNaN(Number(value)))
    return undefined;
  return Number(value);
}

function tituloLengthMin(titulo: string | undefined): string | undefined {
  let value = titulo?.trim();
  if (value === null || value === undefined || value.length < 3)
    return undefined;
  return value;
}

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(backCaido? false : true);

  const sortByInicial =
    (searchParams.get("sortBy") as SortBy) || DEFAULT_SORT_BY;
  const directionInicial =
    (searchParams.get("direction") as Direction) || DEFAULT_DIRECTION;

  const filtrosIniciales: Filtros = {
    titulo: tituloLengthMin(searchParams.get("titulo") as string),
    minPrecio: esNumValido(searchParams.get("minPrecio") as string),
    maxPrecio: esNumValido(searchParams.get("maxPrecio") as string),
    minAhorro: esNumValido(searchParams.get("minAhorro") as string),
    tiers: searchParams.getAll("tiers") as any,
    reviews: searchParams.getAll("reviews") as any,
    tiendaIds: searchParams
      .getAll("tiendaIds")
      .map(esNumValido)
      .filter((v): v is number => v !== undefined),
  };

  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [sortBy, setSortBy] = useState<SortBy>(sortByInicial);
  const [direction, setDirection] = useState<Direction>(directionInicial);
  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSortLabel, setSelectedSortLabel] = useState(
    getLabelFromSort(sortByInicial, directionInicial),
  );

  const rawPage = Number(searchParams.get("page"));
  const initialPage = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const [pagina, setPagina] = useState(initialPage);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const [totalOfertas, setTotalOfertas] = useState<number | null>(null);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [maxPrecio, setMaxPrecio] = useState<number | undefined>(undefined);
  const [ofertaMsj, setOfertaMsj] = useState<{
    title: string;
    mensj: string;
  }>();

  const hasFilters = Boolean(
    (filtros.titulo && filtros.titulo.trim() !== "") ||
    filtros.minPrecio != null ||
    filtros.maxPrecio != null ||
    filtros.minAhorro != null ||
    (filtros.tiers && filtros.tiers.length > 0) ||
    (filtros.tiendaIds && filtros.tiendaIds.length > 0) ||
    (filtros.reviews && filtros.reviews.length > 0),
  );

  const updateFiltros = (nuevo: Filtros) => {
    setFiltros(nuevo);
    setPagina(1);
  };

  const clearFilters = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateFiltros({});
  };

  useEffect(() => {
    if (backCaido)
      return;
    setLoading(true);
    Promise.all([
      ServicioTienda.getAllTiendas(),

      ServicioOfertas.getMaxPrecioOferta(),
    ])
      .then(([resTiendas, resMaxPrecio]) => {
        setTiendas(resTiendas.data);
        setMaxPrecio(resMaxPrecio.data);
      })
      .catch(() => {
        updateFiltros({});
      })
      .finally(() => setLoading(false));

    setOfertaMsj(msjsOfertas[Math.floor(Math.random() * msjsOfertas.length)]);
  }, []);

  useEffect(() => {
    if (backCaido) return;
    ServicioOfertas.getAll({
      page: pagina - 1,
      filtros,
      sortBy,
      direction,
    })
      .then((res) => {
        setOfertas(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalOfertas(res.data.totalElements);

        const params: Record<string, any> = {
          page: pagina,
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
      .catch(() => {
        updateFiltros({});
      });
  }, [pagina, filtros, sortBy, direction]);

  useEffect(() => {
    const newLabel = getLabelFromSort(sortBy, direction);
    setSelectedSortLabel(newLabel);
  }, [sortBy, direction]);

  return (
    <div className="InicioContenedor">
      <motion.div className="JuegosMainLayout">
        {(!backCaido && showPanel) && (
          <motion.div
            className="OverlayPanel"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: showPanel ? 0 : -260, opacity: showPanel ? 1 : 0 }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <PanelFiltros
              filtros={filtros}
              tiendas={tiendas}
              maxPrecio={maxPrecio}
              setFiltros={updateFiltros}
              onClose={() => setShowPanel(false)}
            />
          </motion.div>
        )}

        <div className="juegos-content">
          <div className="header-seccion-juegos">
            <div>
              <h1 className="titulo-principal-pagina">
                {loading ? "Cargando..." : (backCaido ? "Error..." : ofertaMsj?.title)}
              </h1>
              <p className="mensaje-pagina">
                <span>{loading ? " " : totalOfertas !== null ? totalOfertas : ""}</span>{" "}
                {loading ? "Cargando..." : (backCaido ? "Error..." : ofertaMsj?.mensj)}
              </p>
            </div>

            <div className="header-right">
              <div className="barra-controles-moderna">
                <div className="pill-wrapper">
                  <button
                    className={`pill-btn ${!backCaido && showPanel ? "active" : ""}`}
                    onClick={() => setShowPanel(!showPanel)}
                    disabled={backCaido /*|| loading*/}
                  >
                    <span className="icon-filter">{FILTER}</span>
                    Filtros
                  </button>
                  {hasFilters && (
                    <button className="pill-clear-badge" onClick={clearFilters}>
                      ✕
                    </button>
                  )}
                </div>
                <div className="custom-dropdown">
                  <button
                    className={`pill-btn dropdown-trigger ${!backCaido && isOpenSort ? "open" : ""}`}
                    onClick={() => setIsOpenSort(!isOpenSort)}
                    disabled={backCaido /*|| loading*/}
                  >
                    {selectedSortLabel ?? "I'm Error"}
                    <span className="arrow-icon">{isOpenSort ? "▲" : "▼"}</span>
                  </button>

                  {(!backCaido && isOpenSort) && (
                    <ul className="dropdown-menu">
                      {Object.entries(sortLabels).map(([label, config]) => (
                        <li
                          key={label}
                          onClick={() => {
                            setSortBy(config.order);
                            setDirection(config.dir);
                            setSelectedSortLabel(label);
                            setIsOpenSort(false);
                          }}
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="paginator-top">
                <Paginator
                  totalPages={totalPages}
                  currentPage={pagina}
                  onPageChange={(p) => setPagina(p)}
                />
              </div>
            </div>
          </div>

          <OfertasLista loaded={!loading} ofertas={loading||backCaido ? Array(24).fill({}) : ofertas} />
          <div className="paginator-bottom">
            <Paginator
              totalPages={totalPages}
              currentPage={pagina}
              onPageChange={(p) => {
                setPagina(p);
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Ofertas;
