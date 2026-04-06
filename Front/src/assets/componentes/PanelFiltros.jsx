import "../estilos/PanelFiltro.css";

function PanelFiltros({ filtros, setFiltros, generos, plataformas, onClose }) {
  const toggleArray = (campo, valor) => {
    const actual = filtros[campo] || [];
    const nuevo = actual.includes(valor)
      ? actual.filter((v) => v !== valor)
      : [...actual, valor];
    setFiltros({ ...filtros, [campo]: nuevo });
  };

  return (
    <div className="PanelFiltros">
      {/* Botón de cerrar para el layout lateral */}
      <button className="close-panel" onClick={onClose}>✕</button>

      {/* CONSOLAS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Consolas</h2>
        {plataformas.map((p) => (
          <label key={p.id || p.nombre} className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={filtros.consolas.includes(p.nombre)}
              onChange={() => toggleArray("consolas", p.nombre)}
            />
            <span className="fake-checkbox"></span>
            {p.nombre}
          </label>
        ))}
      </div>

      {/* GÉNEROS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Generos</h2>
        {generos.map((g) => (
          <label key={g.id || g.nombre} className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={filtros.generos.includes(g.nombre)}
              onChange={() => toggleArray("generos", g.nombre)}
            />
            <span className="fake-checkbox"></span>
            {g.nombre}
          </label>
        ))}
      </div>

      {/* SECCIÓN PRECIOS (Añadida) */}
      <div className="filtro-seccion">
        <h2 className="filtro-titulo">Precios</h2>
        <div className="precio-input-container">
          <p>Mayor que:</p>
          <input
            type="number"
            placeholder="Mayor..."
            className="input-precio-moderno"
            value={filtros.precioMin || ""}
            onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
          />
        </div>
      </div>

      {/* RATING MÍNIMO */}
      <div className="slider-group">
        <h2 className="filtro-titulo">Rating</h2>
        <div className="slider-with-value">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={filtros.rating ?? 0}
            onChange={(e) =>
              setFiltros({ ...filtros, rating: Number(e.target.value) })
            }
            style={{
              background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${
                ((filtros.rating ?? 0) / 10) * 100
              }%, #2a2a2a ${((filtros.rating ?? 0) / 10) * 100}%, #2a2a2a 100%)`,
            }}
          />
          <span className="slider-value">{filtros.rating ?? 0}</span>
        </div>
      </div>

      {/* RECOMENDADOS */}
      <div className="checkbox-group">
        <h2 className="filtro-titulo">Recomendados</h2>
        <label className="custom-checkbox-container">
          <input
            type="checkbox"
            checked={filtros.recomendados || false}
            onChange={(e) =>
              setFiltros({ ...filtros, recomendados: e.target.checked })
            }
          />
          <span className="fake-checkbox"></span>
          Staff
        </label>
      </div>
    </div>
  );
}

export default PanelFiltros;