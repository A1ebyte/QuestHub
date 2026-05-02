import "./OfertaTarjeta.css";
import { Link } from "react-router-dom";
import WishListBoton from "../WishListBoton";
import { motion } from "framer-motion";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.js";
import { getOfferTier } from "../../const/tiers.ts";

function OfertaTarjeta({
  oferta,
  horizontal = false,
  loaded = true,
  index = 0,
}: {
  oferta: OfertaTarjetaMostrar;
  horizontal?: boolean;
  loaded?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.12,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.03,
        },
      }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
    >
      <Link
        to={oferta.steamAppID ? `/juego/${oferta.steamAppID}` : ""}
        className={horizontal ? "game-card-h-link" : "game-card-link"}
      >
        {!horizontal ? (
          <div className="game-card">
            {loaded && <WishListBoton game={oferta} />}
            <div className="game-card-img-wrapper">
              {!loaded && <div className="img-skeleton"></div>}
              <img
                src={oferta.urlImagen || "/Imagenes/Missing.jpg"}
                alt={oferta.titulo || "Missing Img"}
                className={`card-img ${!loaded ? "hidden" : ""}`}
              />

              {oferta.ahorro && (
                <div className="discount-container">
                  <div className="discount-bg"></div>
                  <div className="discount-bg-skew"></div>
                  <span className="discount-text">
                    -{Math.round(oferta.ahorro)}%
                  </span>
                </div>
              )}
            </div>

            <div className="card-info">
              <div className="info-left">
                <h3>{loaded ? (oferta.titulo || "Error...") : "Cargando..."}</h3>
                {loaded ? (oferta.ofertaRating ? (
                  <div className="offer-tier">
                    <span
                      className="offer-tier-dot"
                      style={{
                        backgroundColor: getOfferTier(oferta.ofertaRating)
                          .color,
                      }}
                    ></span>
                    <span className="offer-tier-text">
                      {getOfferTier(oferta.ofertaRating).text} deal
                    </span>
                  </div>
                ) : (
                  "Error..."
                )) : "Cargando..."}
              </div>

              <div className="info-right">
                <span className="price-label">Desde:</span>
                <span className="price-value">
                  {loaded ? (oferta.precioOferta || "--") + " $": "Cargando..."}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-card-h">
            {loaded && <WishlistButton game={game} />}
            <div className="game-card-h-img">
              {game.rating && (
                <span
                  className={`game-badge ${
                    game.rating >= 7.5
                      ? "alta"
                      : game.rating >= 5
                        ? "media"
                        : "baja"
                  }`}
                >
                  {game.rating}
                </span>
              )}
              <img src={game.image} alt={game.nombre} className="card-img" />
              <img
                src={game.hoverImage}
                alt={game.nombre}
                className="card-img-hover"
              />
            </div>
            <div className="game-card-h-info">
              <h3>{game.nombre}</h3>
              <p className="genre">{game.genre.join(" · ")}</p>
              {game.description && <p className="desc">{game.description}</p>}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default OfertaTarjeta;
