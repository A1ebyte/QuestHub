import "./GameDetalles.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Modal from "../../componentes/Modal/Modal";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";

function GameDetalles() {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const descripcionRef = useRef<HTMLDivElement>(null); // 2. Referencia de la descripción
  // NUEVO ESTADO: Controla si el corazón está rojo (true) o transparente (false)
  const [enWishlist, setEnWishlist] = useState(false);
  //ESTADO: Controla si el texto está expandido
  const [expandido, setExpandido] = useState(false);
  const [descExpandida, setDescExpandida] = useState(false);
  const [indexMedia, setIndexMedia] = useState<number | null>(null);
  // Texto de ejemplo (luego vendrá de tu API)
  const descripcionCompleta = `Hades es un vertiginoso roguelike de acción que combina lo mejor de los juegos de mazmorras con una narrativa profunda. Encarna a Zagreus, el príncipe del Inframundo, y desafía al dios de los muertos mientras te abres paso hacia la superficie con la ayuda de los dioses del Olimpo. En cada intento de fuga, te harás más fuerte y desentrañarás más hilos de la historia en este vibrante mundo inspirado en la mitología griega.`;
  const descripcionCorta = `Hades es un vertiginoso roguelike de acción que combina lo mejor de los juegos de mazmorras con una narrativa profunda. Encarna a Zagreus, el príncipe del Inframundo, y desafía al dios de los muertos mientras te abres paso hacia la superficie...`;
  //Lógica para recortar el texto si no está expandido
  const textoAMostrar = expandido
    ? descripcionCompleta
    : descripcionCompleta.substring(0, 180) + "..."

  //Función para hacer scroll
  const scrollToDescripcion = () => {
    descripcionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  interface MediaItem {
    tipo: 'video' | 'imagen';
    url: string;
  }

  const ofertas = [
    { tienda: "STEAM", nombre: "Hades", precio: "20,00", mejorPrecio: true, logo: "/Imagenes/steam-logo.png" },
    { tienda: "EPIC STORE", nombre: "Hades", precio: "22,00", mejorPrecio: false, logo: "/Imagenes/epic-logo.png" },
    { tienda: "GREEN MAN GAMING", nombre: "Hades", precio: "22,00", mejorPrecio: false, logo: "/Imagenes/gmg-logo.png" },
    { tienda: "GOG.COM", nombre: "Hades", precio: "23,00", mejorPrecio: false, logo: "/Imagenes/gog-logo.png" },
    { tienda: "STEAM", nombre: "Hades + Soundtrack", precio: "30,00", mejorPrecio: false, logo: "/Imagenes/steam-logo.png" }
  ];

  // 1. Definimos el array de medios
  const listaMedia: MediaItem[] = [
    { tipo: 'video', url: 'https://www.youtube.com/embed/91t0ha9x0AE' },
    { tipo: 'imagen', url: '/Imagenes/Gameplay1.png' },
    { tipo: 'imagen', url: '/Imagenes/Gameplay2.png' },
    { tipo: 'imagen', url: '/Imagenes/Gameplay3.png' },
    { tipo: 'imagen', url: '/Imagenes/Gameplay4.png' },
  ];

  /*useEffect(() => {
    ServicioOfertas.getOfertasBySteamId(Number(id))
      .then(res => setJuego(res.data))
      .catch(console.error);
  }, [id]);*/

  return (
    <div className="game-detalles-container">
      {/* SECCIÓN HERO: Con imagen de fondo y degradado */}
      <div className="game-hero" style={{ backgroundImage: `url('/Imagenes/Hades.png')` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Hades</h1>

            <button
              className={`wishlist-btn ${enWishlist ? "active" : ""}`}
              onClick={() => setEnWishlist(!enWishlist)}
            >
              <span>{enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"}</span>
              <svg viewBox="0 0 24 24" className="heart-icon">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL: Imágenes y Acerca de */}
      <div className="game-main-grid">

        {/* COLUMNA IZQUIERDA */}
        <div className="grid-left">
          <img src="/Imagenes/Hades-Portada.png" alt="Hades" className="main-game-img" />

          <div className="acerca-de-section">
            <h2>Acerca de</h2>
            <p>{descripcionCorta}</p>
            <span
              className="leer-mas-btn" onClick={scrollToDescripcion}>
              Leer más            
              </span>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="grid-right">
          {/* Contenedor de Video con icono de Play */}
          <div className="video-container"
            onClick={() => setIndexMedia(0)}
            style={{ cursor: 'pointer' }}
          >
            <img src="/Imagenes/Video.png" alt="Video thumbnail" />
            <div className="play-button">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>

          {/* Rejilla de 4 imágenes pequeñas */}
          <div className="small-images-grid">
            {/* Empezamos desde el índice 1 porque el 0 es el video */}
            {[1, 2, 3, 4].map((idx) => (
              <img
                key={idx}
                src={listaMedia[idx].url}
                alt={`Gameplay ${idx}`}
                onClick={() => setIndexMedia(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

      </div>
      {/* SECCIÓN DE PRECIOS */}
      <div className="precios-section">
        <h2>Precios</h2>
        <div className="precios-lista">
          {ofertas.map((oferta, index) => (
            <div key={index} className="precio-row">
              <div className="row-left">
                <img src={oferta.logo} alt={oferta.tienda} className="tienda-logo" />
                <span className="tienda-nombre">{oferta.tienda}</span>
                <span className="juego-edicion">{oferta.nombre}</span>
                {oferta.mejorPrecio && <span className="badge-mejor-precio">Mejor Precio</span>}
              </div>

              <div className="row-right">
                <span className="precio-texto">{oferta.precio} €</span>
                <button className="comprar-btn">
                  Comprar <span className="arrow">↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DESCRIPCIÓN */}
      <div className="descripcion-section" ref={descripcionRef}>
        <h2>Descripción</h2>
        <p>
          Hades para PC es un juego roguelike, o quizás el mejor término es 'roguelite',
          porque en este juego en realidad estás destinado a morir una y otra vez,
          volviendo al principio un poco más viejo, más sabio y con muchas mejoras
          y potenciadores en tu bolsillo. También tiene muchos elementos de un juego
          de rol y cuenta con una vista isométrica y una banda sonora fantástica
          que mejora la experiencia del juego, especialmente las escenas de combate.
        </p>

        {/* Contenido que aparece solo al expandir */}
        {descExpandida && (
          <div className="descripcion-extra">
            <p>
              Desafía al dios de los muertos mientras te abres paso a golpes fuera del Inframundo
              en este juego de mazmorras de los creadores de Bastion y Transistor.
              Como el Príncipe del Inframundo, blandirás los poderes y las armas míticas del Olimpo
              para liberarte de las garras del mismísimo dios de los muertos.
            </p>
            <img src="/Imagenes/Gameplay-extra.png" alt="Extra gameplay" className="img-expandida" />
          </div>
        )}

        {/* ELEMENTO DE EXPANSIÓN (Línea + Botón) */}
        <div className="expand-container">
          <div className="expand-line"></div>
          <button
            className={`expand-circle-btn ${descExpandida ? 'rotate' : ''}`}
            onClick={() => setDescExpandida(!descExpandida)}
          >
            {descExpandida ? (
              <svg viewBox="0 0 24 24" className="icon-plus"><path d="M19 13H5v-2h14v2z" /></svg> // Icono Menos
            ) : (
              <svg viewBox="0 0 24 24" className="icon-plus"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg> // Icono Más
            )}
          </button>
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
