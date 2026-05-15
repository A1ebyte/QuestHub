import "./GameDetalles.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Modal from "../../componentes/Modal/Modal";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";
import { Bundle } from "../../modelos/Bundle";
import { Videojuego } from "../../modelos/Videojuegos";

function GameDetalles() {
  const { id } = useParams();
  const [datos, setDatos] = useState<Videojuego | Bundle>();
  const [esBundle, setEsBundle] = useState(false);
  const descripcionRef = useRef<HTMLDivElement>(null);
  const [descExpandida, setDescExpandida] = useState(false);
  const descripcionContenidoRef = useRef<HTMLDivElement>(null);
  const [mostrarExpandir, setMostrarExpandir] = useState(false);
  const [enWishlist, setEnWishlist] = useState(false);
  const [indexMedia, setIndexMedia] = useState<number | null>(null);
  
  const comprobarAltura = () => {
    if (descripcionContenidoRef.current) {
      const altura = descripcionContenidoRef.current.scrollHeight;
      setMostrarExpandir(altura > 400);
    }
  };

  useEffect(() => {
    ServicioOfertas.getOfertasBySteamId(Number(id))
      .then((res) => {
        const data = res.data;
        if ("Juego" in data) {
          const juego = data.Juego;
          console.log("ES JUEGO:", juego);
          setDatos(juego);
        }
        if ("Bundle" in data) {
          const bundle = data.Bundle;
          console.log("ES BUNDLE:", bundle);
          setEsBundle(true);
          setDatos(bundle);
        }
      })
      .catch(console.error);

    const handleScroll = () => {
      const offset = window.scrollY * 0.25;
      const bg = document.querySelector(".game-hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    comprobarAltura();
    window.addEventListener("resize", comprobarAltura);
    return () => {
      window.removeEventListener("resize", comprobarAltura);
    };
  }, [datos]);

  const scrollToDescripcion = () => {
    descripcionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="InicioContenedor quitarPadding">
      <div className="game-hero">
        <div
          className="game-hero-bg"
          style={
            {
              "--bg-image": `url(${datos?.imagen})`,
            } as React.CSSProperties
          }
        />
      </div>

      <div className="arreglo-pos">
        {/* OVERLAY (TÍTULO + BOTÓN) */}
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{datos?.nombre}</h1>

            <button
              className={`wishlist-btn ${enWishlist ? "active" : ""}`}
              onClick={() => setEnWishlist(!enWishlist)}
            >
              <span>
                {enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"}
              </span>
              <svg viewBox="0 0 24 24" className="heart-icon">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="game-main-grid">
          {/* IZQUIERDA */}
          <div className="grid-left">
            <img
              src={datos?.imagen}
              alt={datos?.nombre}
              className="main-game-img"
            />

            <div className="acerca-de-section">
              <h2>Acerca de</h2>
              <p>{!esBundle ? datos?.descripcionCorta:("aqui iria lo del bundle")}</p>
              <span className="leer-mas-btn" onClick={scrollToDescripcion}>
                Leer más...
              </span>
            </div>
          </div>

          {/* IMAGENES/VIDEO */}
          <div className="grid-right">
            <div className="video-container" onClick={() => setIndexMedia(0)}>
              <img
                src={
                  datos?.movies?.length ? datos.movies[0]?.thumb : datos?.imagen
                }
                alt="Video thumbnail"
              />
              <div className={`play-button ${datos?.movies?.length ? "":"desactivar"}`}>
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <div className="small-images-grid">
              {Array.isArray(datos?.capturas) &&
                datos.capturas
                  .slice(0, 4)
                  .map((captura, idx) => (
                    <img
                      key={idx}
                      src={captura.thumb}
                      alt={`Gameplay ${idx}`}
                      onClick={() => setIndexMedia((datos?.movies?.length || 0) + idx)}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PRECIOS */}
        <div className="precios-section">
          <h2>Ofertas Actuales</h2>
          {datos?.ofertas.length != 0 ? (
            <div className="precios-lista">
              {datos?.ofertas.map((oferta, indx) => (
                <div key={indx} className="precio-row">
                  {indx === 0 && (
                    <span className="badge-mejor-precio">Mejor Precio</span>
                  )}
                  <div className="row-left">
                    <div className="logo-oferta-container">
                      <img
                        src={oferta.tienda.logo}
                        alt={oferta.tienda.nombre}
                        className="tienda-logo"
                      />
                    </div>
                    <span className="tienda-nombre">
                      {oferta.tienda.nombre}
                    </span>
                    <span className="juego-edicion">{datos?.nombre}</span>
                  </div>

                  <div className="row-right">
                    <div className="detalles-precio">
                      <span className="precioOG-texto">
                        {oferta.precioOriginal}$
                      </span>
                      <span className="ahorro-texto">
                        - {Math.round(oferta.ahorro)}%
                      </span>
                      <span className="precio-texto">
                        {oferta.precioOferta}$
                      </span>
                    </div>
                    <button
                      className="comprar-btn"
                      onClick={() =>
                        window.open(`${oferta.urlCompra}`, "_blank")
                      }
                    >
                      Ver Oferta <span className="arrow">↗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-oferta">
              No hay ofertas de momento para este juego ...
            </p>
          )}
        </div>

        {/* DESCRIPCIÓN */}
        <div className="descripcion-section" ref={descripcionRef}>
        {!esBundle ? (<><div className="grid-left">
            <h2 className="description-title">Descripción</h2>
            <div
              ref={descripcionContenidoRef}
              className={`description ${descExpandida ? "expanded" : "cut"}`}
              dangerouslySetInnerHTML={{ __html: datos?.descripcion || "" }}
            />
            {/* ELEMENTO DE EXPANSIÓN */}
            {mostrarExpandir && (
              <div className="expand-container">
                <div className="expand-line"></div>
                <button
                  className={`expand-circle-btn ${descExpandida ? "rotate" : ""}`}
                  onClick={() => setDescExpandida(!descExpandida)}
                >
                  {descExpandida ? (
                    <svg viewBox="0 0 24 24" className="icon-plus">
                      <path d="M19 13H5v-2h14v2z" />
                    </svg> // Icono Menos
                  ) : (
                    <svg viewBox="0 0 24 24" className="icon-plus">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg> // Icono Más
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="grid-right detalles-card">
            <h2 className="description-title">Detalles</h2>

            <div className="detalle-item">
              <h1 className="detalle-label">DESARROLLADORES</h1>
              <span className="detalle-value">{datos?.desarrolladores}</span>
            </div>

            <div className="detalle-item">
              <h1 className="detalle-label">DISTRIBUIDORES</h1>
              <span className="detalle-value">{datos?.distribuidores}</span>
            </div>

            <div className="detalle-item">
              <h1 className="detalle-label">LANZAMIENTO</h1>
              <span className="detalle-value">
                {new Date(datos?.lanzamiento).toLocaleDateString()}
              </span>
            </div>

            <div className="detalle-item">
              <h1 className="detalle-label">GENEROS</h1>
              <span className="detalle-value">{datos?.generos.join(", ")}</span>
            </div>

            <div className="detalle-item">
              <h1 className="detalle-label">RATING</h1>
              <span className="detalle-value rating">
                {datos?.rating} / 100
              </span>
            </div>

            <div className="detalle-item">
              <h1 className="detalle-label">REVIEWS</h1>
              <span className="detalle-value review-text">
                {datos?.ratingText}
              </span>
            </div>
          </div></>):("Aqui va el bundle")}
        </div>
      </div>

      <Modal
        movies={datos?.movies || []}
        captures={datos?.capturas || []}
        activeIndex={indexMedia}
        onClose={() => setIndexMedia(null)}
        onNavigate={(newIndex) => setIndexMedia(newIndex)}
      />
    </div>
  );
}

export default GameDetalles;
