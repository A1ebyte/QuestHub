import "./Ofertas.css";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicioOfertas from "../../servicios/Axios/ServicioOfertas.ts";
import ServicioTienda from "../../servicios/Axios/ServicioTienda.ts";

import OfertasLista from "../../componentes/OfertaLista/OfertasLista.tsx";
import PanelFiltros from "../../componentes/PanelFiltros/PanelFiltros.tsx";
import Paginator from "../../componentes/Paginator/Paginator.tsx";

import { Filtros } from "../../modelos/Pageable.ts";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.ts";
import { Tienda } from "../../modelos/Tienda.ts";

import {
  DEFAULT_DIRECTION,
  DEFAULT_SORT_BY,
  Direction,
  SortBy,
  sortLabels,
  getLabelFromSort,
} from "../../const/sort.ts";

import { FILTER } from "../../const/iconos.tsx";
import { msjsOfertas } from "../../const/mensajesOfertas.ts";
import { backCaido } from "../../servicios/Axios/http-axios.ts";

function esNumValido(v: string | null): number | undefined {
  if (!v || isNaN(Number(v))) return undefined;
  return Number(v);
}

function tituloValido(v: string | null): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  return t.length >= 3 ? t : undefined;
}

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = Number(searchParams.get("page") || 1);

  const sortBy = (searchParams.get("sortBy") as SortBy) || DEFAULT_SORT_BY;
  const direction =
    (searchParams.get("direction") as Direction) || DEFAULT_DIRECTION;

  const filtros: Filtros = useMemo(() => {
    return {
      titulo: tituloValido(searchParams.get("titulo")),
      minPrecio: esNumValido(searchParams.get("minPrecio")),
      maxPrecio: esNumValido(searchParams.get("maxPrecio")),
      minAhorro: esNumValido(searchParams.get("minAhorro")),
      tiers: searchParams.getAll("tiers") as any,
      reviews: searchParams.getAll("reviews") as any,
      tiendaIds: searchParams
        .getAll("tiendaIds")
        .map(esNumValido)
        .filter((v): v is number => v !== undefined),
    };
  }, [searchParams]);

  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOfertas, setTotalOfertas] = useState<number | null>(null);

  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [maxPrecio, setMaxPrecio] = useState<number>();

  const [loading, setLoading] = useState(true);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const [ofertaMsj, setOfertaMsj] = useState<any>();

  const sortRef = useRef<HTMLDivElement>(null);

  const selectedSortLabel = getLabelFromSort(sortBy, direction);

  const hasFilters = useMemo(() => {
    return Object.values(filtros).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== undefined,
    );
  }, [filtros]);

  const updateSearchParams = (
    updates: Record<string, any>,
    resetPage = false,
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
        return;
      }

      params.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.set(key, value.toString());
      }
    });

    if (resetPage) params.set("page", "1");

    setSearchParams(params, { replace: true });
  };

  const setFiltros = (nuevo: Partial<Filtros>) => {
    const params = new URLSearchParams(searchParams);

    let changed = false;

    Object.entries(nuevo).forEach(([key, value]) => {
      const prev = params.getAll(key);

      const next = Array.isArray(value)
        ? value.map(String)
        : value !== undefined && value !== null
          ? [String(value)]
          : [];

      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        changed = true;
      }
    });

    updateSearchParams(nuevo, changed);
  };

  const clearFilters = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setSearchParams(
      {
        page: "1",
        sortBy: DEFAULT_SORT_BY,
        direction: DEFAULT_DIRECTION,
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (backCaido) return;

    setLoading(true);

    Promise.all([
      ServicioTienda.getAllTiendas(),
      ServicioOfertas.getMaxPrecioOferta(),
    ])
      .then(([t, p]) => {
        setTiendas(t.data);
        setMaxPrecio(p.data);
      })
      .finally(() => setLoading(false));

    setOfertaMsj(msjsOfertas[Math.floor(Math.random() * msjsOfertas.length)]);
  }, []);

  useEffect(() => {
    if (backCaido) return;

    setLoading(true);

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
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="InicioContenedor">
      <motion.div className="JuegosMainLayout">
        {!backCaido && showPanel && (
          <motion.div
            className="OverlayPanel"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <PanelFiltros
              filtros={filtros}
              tiendas={tiendas}
              maxPrecio={maxPrecio}
              setFiltros={setFiltros}
              onClose={() => setShowPanel(false)}
            />
          </motion.div>
        )}

        <div className="juegos-content">
          <div className="header-seccion-juegos">
            <div>
              <h1 className="titulo-principal-pagina">
                {loading ? "Cargando..." : ofertaMsj?.title}
              </h1>
              <p className="mensaje-pagina">
                <span>{loading ? "" : totalOfertas}</span> {ofertaMsj?.mensj}
              </p>
            </div>

            <div className="header-right">
              <div className="barra-controles-moderna">
                <div className="pill-wrapper">
                  <button
                    className={`pill-btn ${showPanel ? "active" : ""}`}
                    onClick={() => setShowPanel(!showPanel)}
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

                <div className="custom-dropdown" ref={sortRef}>
                  <button
                    className="pill-btn dropdown-trigger"
                    onClick={() => setIsOpenSort(!isOpenSort)}
                  >
                    {selectedSortLabel}
                    <span>{isOpenSort ? "▲" : "▼"}</span>
                  </button>

                  {isOpenSort && (
                    <ul className="dropdown-menu">
                      {Object.entries(sortLabels).map(([label, config]) => (
                        <li
                          key={label}
                          onClick={() => {
                            updateSearchParams(
                              {
                                sortBy: config.order,
                                direction: config.dir,
                              },
                              true,
                            );
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

              <Paginator
                totalPages={totalPages}
                currentPage={pagina}
                onPageChange={(p) => updateSearchParams({ page: p })}
              />
            </div>
          </div>

          <OfertasLista
            loaded={!loading}
            ofertas={loading || backCaido ? Array(24).fill({}) : ofertas}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Ofertas;
