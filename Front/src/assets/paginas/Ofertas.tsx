import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicioOfertas from "../servicios/Axios/ServicioOfertas.ts";
import { OfertaTarjetaMostrar } from "../modelos/Ofertas.ts";
import { Filtros } from "../modelos/Pageable.ts";

import OfertasLista from "../componentes/OfertaLista/OfertasLista.tsx";
import PanelFiltros from "../componentes/PanelFiltros.tsx";
import Paginator from "../componentes/Paginator.tsx";

import "../estilos/Paginas/Ofertas.css";

function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. LEER FILTROS DESDE LA URL
  const filtrosIniciales: Filtros = {
    titulo: searchParams.get("titulo") || "",
    minPrecio: searchParams.get("minPrecio") ? Number(searchParams.get("minPrecio")) : undefined,
    maxPrecio: searchParams.get("maxPrecio") ? Number(searchParams.get("maxPrecio")) : undefined,
    minAhorro: searchParams.get("minAhorro") ? Number(searchParams.get("minAhorro")) : undefined,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
    minReviews: searchParams.get("minReviews") ? Number(searchParams.get("minReviews")) : undefined,
    inicioOferta: searchParams.get("inicioOferta") || undefined,
    tiendaIds: searchParams.getAll("tiendaIds").map(Number),
  };

  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);

  const [ofertas, setOfertas] = useState<OfertaTarjetaMostrar[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const initialPage = Number(searchParams.get("page")) || 1;
  const [pagina, setPagina] = useState(initialPage);

  const [showPanel, setShowPanel] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  // 2. ACTUALIZAR URL CUANDO CAMBIAN FILTROS O PÁGINA
  useEffect(() => {
    const params: any = { page: pagina.toString() };

    Object.entries(filtros).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          params[key] = value;
        });
      } else {
        params[key] = value.toString();
      }
    });

    setSearchParams(params);
  }, [pagina, filtros]);

  // 3. LLAMAR AL BACKEND
  useEffect(() => {
    ServicioOfertas.getAll({
      page: pagina - 1,
      filtros: filtros,
    })
      .then((res) => {
        setOfertas(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [pagina, filtros]);

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
