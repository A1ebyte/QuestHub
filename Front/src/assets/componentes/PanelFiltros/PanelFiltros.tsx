import "./PanelFiltro.css";
import { Filtros } from "../../modelos/Pageable";
import { useEffect, useState } from "react";
import ServicioTienda from "../../servicios/Axios/ServicioTienda.ts";
import { Tienda } from "../../modelos/Tienda.ts";
import { TIERS } from "../../const/tiers";

function PanelFiltros({filtros,setFiltros,onClose,}: {filtros: Filtros; setFiltros: (f: Filtros) => void; onClose: () => void;}) {
  
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [tituloLocal, setTituloLocal] = useState("");

  useEffect(() => {
    ServicioTienda.getAllTiendas()
      .then((res) => setTiendas(res.data))
      .catch((err) => console.error("Error cargando tiendas:", err));
  }, []);

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
      <button className="close-panel" onClick={onClose}>
        ✕
      </button>

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
            setFiltros({...filtros,titulo: value.trim().length >= 3 ? value : undefined
            });
          }}
        />
      </div>

      {/* PRECIOS */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Precio</h2>

        <div className="precio-input-container">
          <p>Mínimo:</p>
          <input
            type="number"
            placeholder="0"
            className="input-precio-moderno"
            value={filtros.minPrecio ?? ""}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                minPrecio: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="precio-input-container">
          <p>Máximo:</p>
          <input
            type="number"
            placeholder="100"
            className="input-precio-moderno"
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
        <input
          type="number"
          placeholder="ahorro"
          min={0}
          max={100}
          className="input-precio-moderno"
          value={filtros.minAhorro ?? ""}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              minAhorro: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
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
            {t.label}
          </label>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Reviews mínimas</h2>
        <input
          type="number"
          className="input-precio-moderno"
          value={filtros.minReviews ?? ""}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              minReviews: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      {/* FECHA */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Ofertas desde</h2>
        <input
          type="date"
          className="input-precio-moderno"
          value={filtros.inicioOferta?.split("T")[0] || ""}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              inicioOferta: e.target.value
                ? `${e.target.value}T00:00:00`
                : undefined,
            })
          }
        />
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
