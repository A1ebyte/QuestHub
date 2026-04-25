import "./PanelFiltro.css";
import { Filtros } from "../../modelos/Pageable";
import { useState } from "react";
import { TIERS } from "../../const/tiers";
import { Tienda } from "../../modelos/Tienda";
import { REVIEWS } from "../../const/reviews";

function PanelFiltros({
  filtros,
  tiendas,
  maxPrecio = 100,
  setFiltros,
  onClose,
}: {
  filtros: Filtros;
  tiendas: Tienda[];
  maxPrecio?: number;
  setFiltros: (f: Filtros) => void;
  onClose: () => void;
}) {
  const [tituloLocal, setTituloLocal] = useState(filtros.titulo ?? "");
  const [ahorroLocal, setAhorroLocal] = useState(filtros.minAhorro ?? 0);

  const toggleTienda = (id: number) => {
    const actual = filtros.tiendaIds || [];
    const nuevo = actual.includes(id)
      ? actual.filter((v) => v !== id)
      : [...actual, id];

    setFiltros({ ...filtros, tiendaIds: nuevo });
  };

  const toggleTier = (tier: string) => {
    const actual = filtros.tiers || [];
    const nuevo = actual.includes(tier as any)
      ? actual.filter((t) => t !== tier)
      : [...actual, tier as any];

    setFiltros({ ...filtros, tiers: nuevo });
  };

  return (
    <div className="PanelFiltros">
      <div className="panel-header">
        <span className="panel-close" onClick={onClose}>
          ✕
        </span>
      </div>

      {/* TÍTULO */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Título</h2>
        <input
          type="text"
          placeholder="Buscar por título..."
          className="input-precio-moderno"
          value={tituloLocal}
          onChange={(e) => {
            const value = e.target.value;
            setTituloLocal(value);
            setFiltros({
              ...filtros,
              titulo: value.trim().length >= 3 ? value : undefined,
            });
          }}
        />
      </div>

      {/* PRECIOS */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Precio</h2>

        <div className="precio-rango-inline">
          <input
            type="number"
            placeholder="min"
            className="input-precio-moderno"
            min={0}
            max={filtros.maxPrecio ?? maxPrecio}
            value={filtros.minPrecio ?? ""}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                minPrecio: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />

          <span className="hasta-texto">Hasta</span>

          <input
            type="number"
            placeholder="max"
            className="input-precio-moderno"
            max={maxPrecio}
            min={filtros.minPrecio ?? 0}
            value={filtros.maxPrecio ?? ""}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                maxPrecio: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      {/* AHORRO */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Descuento mínimo (%)</h2>

        <div className="slider-ahorro-container">
          <input
            type="range"
            min={0}
            max={100}
            value={ahorroLocal}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAhorroLocal(value);
            }}
            onMouseUp={() => {
              setFiltros({
                ...filtros,
                minAhorro: ahorroLocal === 0 ? undefined : ahorroLocal,
              });
            }}
            onTouchEnd={() => {
              setFiltros({
                ...filtros,
                minAhorro: ahorroLocal === 0 ? undefined : ahorroLocal,
              });
            }}
          />

          <span className="slider-ahorro-valor">
            {ahorroLocal === 0 ? "– %" : `${ahorroLocal} %`}
          </span>
        </div>
      </div>

      {/* TIERS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Tier de oferta</h2>

        {TIERS.map((t) => (
          <label
            key={t.id}
            className="custom-checkbox-container"
            style={{ "--tier-color": t.color } as React.CSSProperties}
          >
            <input
              type="checkbox"
              checked={filtros.tiers?.includes(t.id) || false}
              onChange={() => toggleTier(t.id)}
            />
            <span className="fake-checkbox"></span>
            {t.text}
          </label>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Reviews</h2>

        {REVIEWS.map((r) => (
          <label key={r.id} className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={filtros.reviews?.includes(r.id) || false}
              onChange={() => {
                const actual = filtros.reviews || [];
                const nuevo = actual.includes(r.id)
                  ? actual.filter((v) => v !== r.id)
                  : [...actual, r.id];

                setFiltros({ ...filtros, reviews: nuevo });
              }}
            />
            <span className="fake-checkbox"></span>
            {r.text}
          </label>
        ))}
      </div>

      {/* TIENDAS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Tiendas</h2>

        {tiendas.length === 0 && <p>Cargando tiendas...</p>}

        {tiendas.map((t) => (
          <label key={t.tiendaID} className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={filtros.tiendaIds?.includes(t.tiendaID) || false}
              onChange={() => toggleTienda(t.tiendaID)}
            />
            <span className="fake-checkbox"></span>
            {t.nombre}
          </label>
        ))}
      </div>
    </div>
  );
}

export default PanelFiltros;
