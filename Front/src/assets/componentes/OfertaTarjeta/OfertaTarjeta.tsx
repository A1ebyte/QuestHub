import "./OfertaTarjeta.css";
import { Link } from "react-router-dom";
import WishListBoton from "../WishListBoton/WishListBoton";
import { motion } from "framer-motion";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas";
import { getOfferTier } from "../../const/tiers";

function OfertaTarjeta({
  oferta,
  loaded = true,
  index = 0,
}: {
  oferta: OfertaTarjetaMostrar;
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
        className="game-card-link"
      >
        <div className="game-card">
          {loaded && <WishListBoton deseado={oferta} />}
          <div className="game-card-img-wrapper">
            {!loaded && <div className="img-skeleton"></div>}
            <img
              loading="lazy"
              decoding="async"
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
              <h3>{loaded ? oferta.titulo || "Error..." : "Cargando..."}</h3>
              {loaded ? (
                oferta.ofertaRating ? (
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
                )
              ) : (
                "Cargando..."
              )}
            </div>

            <div className="info-right">
              <span className="price-label">Desde:</span>
              <span className="price-value">
                {loaded
                  ? oferta.precioOferta != null
                    ? oferta.precioOferta + " $"
                    : "--"
                  : "Cargando..."}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default OfertaTarjeta;
