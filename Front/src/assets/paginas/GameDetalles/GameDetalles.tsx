import "./GameDetalles.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ModalMedia from "../../componentes/Modals/Media/ModalMedia";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";
import { Bundle } from "../../modelos/BundleMod";
import { Captura, Movie, Videojuego } from "../../modelos/VideojuegosMod";
import { backCaido } from "../../servicios/Axios/http-axios";
import { useWishlistContext } from "../../context/WishlistContext";
import { CORAZON } from "../../const/iconos";

function GameDetalles() {
  const { id } = useParams();
  const [datos, setDatos] = useState<Videojuego | Bundle>();
  const [esBundle, setEsBundle] = useState(false);
  const [imagenes, setImagenes] = useState<Captura[]>([]);
  const [videos, setVideos] = useState<Movie[]>([]);
  const [descExpandida, setDescExpandida] = useState(false);
  const [mostrarExpandir, setMostrarExpandir] = useState(false);
  const [indexMedia, setIndexMedia] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toggleJuego, estaEnWishlist } = useWishlistContext();
  
  const enWishlist = estaEnWishlist(id?Number(id):0);
  const descripcionRef = useRef<HTMLDivElement>(null);
  const descripcionContenidoRef = useRef<HTMLDivElement>(null);

  const comprobarAltura = () => {
    if (descripcionContenidoRef.current) {
      const altura = descripcionContenidoRef.current.scrollHeight;
      setMostrarExpandir(altura > 450);
    }
  };

  useEffect(() => {
    if(backCaido) return
    
    ServicioOfertas.getOfertasBySteamId(Number(id))
      .then((res) => {
        const data = res.data;
        if ("Juego" in data) {
          const juego = data.Juego;
          setDatos(juego);
          setImagenes(juego.capturas);
          setVideos(juego.movies);
        }
        if ("Bundle" in data) {
          const bundle = data.Bundle;
          setEsBundle(true);
          setDatos(bundle);
          setImagenes(bundle.productos.flatMap((pr) => pr.capturas));
          setVideos(bundle.productos.flatMap((pr) => pr.movies));
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

  const handleAction = async (e: React.MouseEvent) => {
    console.log("hello")
      if (isProcessing || !id) {
        console.error("No se pudo determinar el ID del juego/bundle", id);
        return;
      }
      setIsProcessing(true);
      try {
        await toggleJuego(Number(id));
      } catch (error) {
        console.error("Error en el botón:", error);
      } finally {
        setIsProcessing(false);
      }
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
              className={`wishlist-btn`}
              title={ isProcessing ? "Procesando..." : enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"}
              onClick={handleAction}
            >
              <span>
                {enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"}
              </span>
              <div className={`wishlist-icon ${enWishlist ? "active" : ""}`}>
                {CORAZON}
              </div>
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="game-main-grid">
          {/* IZQUIERDA */}
          <div className="grid-left">
            <img
              loading="lazy"
              decoding="async"
              src={datos?.imagen}
              alt={datos?.nombre}
              className="main-game-img"
            />

            <div className="acerca-de-section">
              <h2>Acerca de</h2>
              <p>
                {!esBundle
                  ? (datos as Videojuego)?.descripcionCorta
                  : `Disfruta del bundle ${datos?.nombre}, que consta de una selección de contenido digital cuidadosamente agrupado para ofrecerte más valor y horas de entretenimiento. 
                  Ideal para ampliar tu experiencia de juego con una variedad de títulos y contenido adicional.`}
              </p>
              <span className="leer-mas-btn" onClick={scrollToDescripcion}>
                Leer más...
              </span>
            </div>
          </div>

          {/* IMAGENES/VIDEO */}
          <div className="grid-right">
            <div className="video-container" onClick={() => setIndexMedia(0)}>
              <img
                loading="lazy"
                decoding="async"
                src={videos.length ? videos[0].thumb : datos?.imagen}
                alt="Video thumbnail"
              />
              <div
                className={`play-button ${videos.length ? "" : "desactivar"}`}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <div className="small-images-grid">
              {imagenes.slice(0, 4).map((captura, idx) => (
                <img
                  loading="lazy"
                  decoding="async"
                  key={idx}
                  src={captura.thumb}
                  alt={`Gameplay ${idx}`}
                  onClick={() => setIndexMedia((videos.length || 0) + idx)}
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
                        loading="lazy"
                        decoding="async"
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
                        {oferta.precioOferta.toFixed(2)}$
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
        <div
          className={`descripcion-section ${esBundle ? "bundle-section" : ""}`}
          ref={descripcionRef}
        >
          {!esBundle ? (
            <>
              <div className="grid-left">
                <h2 className="description-title">Descripción</h2>
                <div
                  ref={descripcionContenidoRef}
                  className={`description ${descExpandida ? "expanded" : "cut"}`}
                  dangerouslySetInnerHTML={{
                    __html: (datos as Videojuego)?.descripcion || "",
                  }}
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
                  <span className="detalle-value">
                    {(datos as Videojuego)?.desarrolladores}
                  </span>
                </div>

                <div className="detalle-item">
                  <h1 className="detalle-label">DISTRIBUIDORES</h1>
                  <span className="detalle-value">
                    {(datos as Videojuego)?.distribuidores}
                  </span>
                </div>

                <div className="detalle-item">
                  <h1 className="detalle-label">LANZAMIENTO</h1>
                  <span className="detalle-value">
                    {new Date(
                      (datos as Videojuego)?.lanzamiento,
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="detalle-item">
                  <h1 className="detalle-label">GENEROS</h1>
                  <span className="detalle-value">
                    {(datos as Videojuego)?.generos.join(", ")}
                  </span>
                </div>

                <div className="detalle-item">
                  <h1 className="detalle-label">RATING</h1>
                  <span className="detalle-value rating">
                    {(datos as Videojuego)?.rating} / 100
                  </span>
                </div>

                <div className="detalle-item">
                  <h1 className="detalle-label">REVIEWS</h1>
                  <span className="detalle-value review-text">
                    {(datos as Videojuego)?.ratingText}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* --- VISTA PARA BUNDLE REAL --- */
            <div className="bundle-full-width">
              <h2 className="description-title">Contenido del Conjunto</h2>
              <div
                ref={descripcionContenidoRef}
                className={`description ${descExpandida ? "expanded" : "cut"}`}
              >
                <div>
                  <p>
                    Descubre todo lo que forma parte de {datos?.nombre} y
                    explora la selección de juegos, expansiones y contenido
                    adicional incluidos en este pack. Cada elemento ha sido
                    reunido para ofrecer una experiencia más completa, con más
                    contenido, más opciones y nuevas formas de disfrutar tus
                    títulos favoritos.
                  </p>
                  <p>
                    A continuación, podrás ver todos los productos incluidos en
                    este bundle junto con una una breve descripción de cada uno.
                  </p>
                </div>
                {(datos as Bundle).productos?.map((juego, indx) => (
                  <div key={indx} className="bundle-item-horizontal">
                    <div className="bundle-item-img-container">
                      <img
                        loading="lazy"
                        decoding="async" 
                        src={juego.imagen} 
                        alt={juego.nombre} />
                    </div>
                    <div className="bundle-item-info">
                        <h3>{juego.nombre}</h3>
                        <p>{juego.acerca}</p>
                    </div>
                  </div>
                ))}
              </div>
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
          )}
        </div>
      </div>

      <ModalMedia
        movies={videos || []}
        captures={imagenes || []}
        activeIndex={indexMedia}
        onClose={() => setIndexMedia(null)}
        onNavigate={(newIndex) => setIndexMedia(newIndex)}
      />
    </div>
  );
}

export default GameDetalles;
