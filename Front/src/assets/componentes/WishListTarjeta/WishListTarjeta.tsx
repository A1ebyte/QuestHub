import "../OfertaTarjeta/OfertaTarjeta.css";
import { Link } from "react-router-dom";
import WishListBoton from "../WishListBoton/WishListBoton.tsx";
import { motion } from "framer-motion";
import { getOfferTier } from "../../const/tiers.ts";

function WishListTarjeta({
  oferta,
  loaded = true,
  index = 0,
}: {
  oferta: any;
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
          </div>

          <div className="card-info">
            <div className="info-left">
              <h3>{loaded ? oferta.titulo || "Error..." : "Cargando..."}</h3>
              {loaded ? (
                oferta.onSale !=null ? (
                  <div className="offer-tier">
                    <span
                      className="offer-tier-dot"
                      style={{
                        backgroundColor: oferta.onSale ? "#38f157" : "#e63946",
                      }}
                    ></span>
                    <span className="offer-tier-text">
                      DEAL {oferta.onSale ? "ON": "OFF"}
                    </span>
                  </div>
                ) : (
                  "Error..."
                )
              ) : (
                "Cargando..."
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default WishListTarjeta;
