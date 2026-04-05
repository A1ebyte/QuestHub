import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../estilos/GameTarjeta.css";
import "../estilos/GameTarjetaHor.css";
import WishlistButton from "./WishListBoton";

function GameTarjeta({ game, horizontal = false, index = 0 }) {
  return (
    <motion.div
      layout // importante para reorder animado
      initial={{ opacity: 0, y: 20 }} // fade + slide entrada
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }} // fade + slide salida
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link
        to={`/juego/${game.id}`}
        className={horizontal ? "game-card-h-link" : "game-card-link"}
      >
        {!horizontal ? (
          <div className="game-card">
            <WishlistButton game={game} />
            <div className="game-card-img-wrapper">
              <img src={game.image} alt={game.nombre} className="card-img" />
              <img
                src={game.hoverImage}
                alt={game.nombre}
                className="card-img-hover"
              />
                          {
              /*game.discount && (*/
              <div class="discount-container">
                <div class="discount-bg"></div>
                <div class="discount-bg-skew"></div>
                <span class="discount-text">-10%</span>
              </div>
              /*)*/
            }
            </div>

            <div className="card-info">
              <div className="info-left">
                <h3>{game.nombre}</h3>
                <p className="genres">{game.genre.join(" · ")}</p>
              </div>

              <div className="info-right">
                <span className="price-label">Desde:</span>
                <span className="price-value">{game.price}20€</span>
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

export default GameTarjeta;
