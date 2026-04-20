import "./OfertaTarjeta.css";
import { Link } from "react-router-dom";
import WishListBoton from "../WishListBoton";
import { motion } from "framer-motion";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.js";
import { getOfferTier } from "../../const/tiers.ts";

function OfertaTarjeta({
  oferta,
  horizontal = false,
  index = 0,
}: {
  oferta: OfertaTarjetaMostrar;
  horizontal?: boolean;
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
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1], 
      delay: index * 0.04,
    }
  }}
  exit={{ opacity: 0, y: 16, scale: 0.96 }}
>

      <Link
        to={`/juego/${oferta.steamAppID}`}
        className={horizontal ? "game-card-h-link" : "game-card-link"}
      >
        {!horizontal ? (
          <div className="game-card">
            <WishListBoton game={oferta} />
            <div className="game-card-img-wrapper">
              <img
                src={oferta.urlImagen}
                alt={oferta.titulo}
                className="card-img"
              />
              {
                /*game.discount && (*/
                <div className="discount-container">
                  <div className="discount-bg"></div>
                  <div className="discount-bg-skew"></div>
                  <span className="discount-text">
                    -{Math.round(oferta.ahorro)}%
                  </span>
                </div>
                /*)*/
              }
            </div>

            <div className="card-info">
              <div className="info-left">
                <h3>{oferta.titulo}</h3>
                {(() => {
                  const tier = getOfferTier(oferta.ofertaRating);
                  return (
                    <div className="offer-tier">
                      <span
                        className="offer-tier-dot"
                        style={{ backgroundColor: tier.color }}
                      ></span>
                      <span className="offer-tier-text">{tier.text} deal</span>
                    </div>
                  );
                })()}
              </div>

              <div className="info-right">
                <span className="price-label">Desde:</span>
                <span className="price-value">{oferta.precioOferta}$</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-card-h">
            <WishlistButton game={game} />
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
