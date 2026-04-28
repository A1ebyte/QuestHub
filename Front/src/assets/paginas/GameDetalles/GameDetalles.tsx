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
  const descripcionRef = useRef<HTMLDivElement>(null);
  const [enWishlist, setEnWishlist] = useState(false);
  const [descExpandida, setDescExpandida] = useState(false);
  const [indexMedia, setIndexMedia] = useState<number | null>(null);

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
          setDatos(bundle);
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.25;
      const bg = document.querySelector(".game-hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Función para hacer scroll
  const scrollToDescripcion = () => {
    descripcionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  interface MediaItem {
    tipo: "video" | "imagen";
    url: string;
  }

  const ofertas = [
    {
      tienda: "STEAM",
      nombre: "Hades",
      precio: "20,00",
      mejorPrecio: true,
      logo: "/Imagenes/steam-logo.png",
    },
    {
      tienda: "EPIC STORE",
      nombre: "Hades",
      precio: "22,00",
      mejorPrecio: false,
      logo: "/Imagenes/epic-logo.png",
    },
    {
      tienda: "GREEN MAN GAMING",
      nombre: "Hades",
      precio: "22,00",
      mejorPrecio: false,
      logo: "/Imagenes/gmg-logo.png",
    },
    {
      tienda: "GOG.COM",
      nombre: "Hades",
      precio: "23,00",
      mejorPrecio: false,
      logo: "/Imagenes/gog-logo.png",
    },
    {
      tienda: "STEAM",
      nombre: "Hades + Soundtrack",
      precio: "30,00",
      mejorPrecio: false,
      logo: "/Imagenes/steam-logo.png",
    },
  ];

  // 1. Definimos el array de medios
  const listaMedia: MediaItem[] = [
    { tipo: "video", url: "https://www.youtube.com/embed/91t0ha9x0AE" },
    { tipo: "imagen", url: "/Imagenes/Gameplay1.png" },
    { tipo: "imagen", url: "/Imagenes/Gameplay2.png" },
    { tipo: "imagen", url: "/Imagenes/Gameplay3.png" },
    { tipo: "imagen", url: "/Imagenes/Gameplay4.png" },
  ];

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
              <h3>Acerca de</h3>
              <p>{datos?.descripcionCorta}</p>
              <span className="leer-mas-btn" onClick={scrollToDescripcion}>
                Leer más
              </span>
            </div>
          </div>

          {/* DERECHA */}
          <div className="grid-right">
            <div className="video-container" onClick={() => setIndexMedia(0)}>
              <img
                src={
                  Array.isArray(datos?.movies)
                    ? datos.movies[0]?.thumb
                    : datos?.movies?.thumb
                }
                alt="Video thumbnail"
              />
              <div className="play-button">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <div className="small-images-grid">
              {[1, 2, 3, 4].map((idx: number) => (
                <img
                  key={idx}
                  src={
                    Array.isArray(datos?.capturas)
                      ? datos.capturas[idx]?.thumb
                      : datos?.capturas?.thumb
                  }
                  alt={`Gameplay ${idx}`}
                  onClick={() => setIndexMedia(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PRECIOS */}
        <div className="precios-section">
          <h3>Ofertas</h3>
          <div className="precios-lista">
            {datos?.ofertas.map((oferta, index) => (
              <div key={index} className="precio-row">
                <div className="row-left">
                  <img
                    src={oferta.tienda.logo}
                    alt={oferta.tienda.nombre}
                    className="tienda-logo"
                  />
                  <span className="tienda-nombre">{oferta.tienda.nombre}</span>
                  <span className="juego-edicion">{datos.nombre}</span>
                  {/*                   {oferta. && (
                    <span className="badge-mejor-precio">Mejor Precio</span>
                  )} */}
                </div>

                <div className="row-right">
                  <span className="precio-texto">{oferta.precioOferta} $</span>
                  <button
                    className="comprar-btn"
                    onClick={() => window.open(`${oferta.urlCompra}`, "_blank")}
                  >
                    Comprar <span className="arrow">↗</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN DESCRIPCIÓN */}
        <div className="descripcion-section" ref={descripcionRef}>
          <h3>Descripción</h3>
          <div dangerouslySetInnerHTML={{ __html: datos?.descripcion || "" }} />

          {/* Contenido que aparece solo al expandir */}
          {descExpandida && (
            <div
              className="descripcion-extra"
              dangerouslySetInnerHTML={{ __html: datos?.acercaDe || "" }}
            />
          )}

          {/* ELEMENTO DE EXPANSIÓN (Línea + Botón) */}
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
        </div>
      </div>

      <Modal
        items={listaMedia}
        activeIndex={indexMedia}
        onClose={() => setIndexMedia(null)}
        onNavigate={(newIndex) => setIndexMedia(newIndex)}
      />
    </div>
  );
}

export default GameDetalles;
