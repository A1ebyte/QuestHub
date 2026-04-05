import GameTarjeta from "./GameTarjeta.jsx";
import "../estilos/GameLista.css";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


function GameLista({
  juegos,
  columnas = 4,
  horizontal = false,
}) {
  return (
    <div
      className={`grid ${horizontal ? "horizontal" : ""}`}
      style={{ "--columnas": columnas }}
    >
      <AnimatePresence>
        {juegos.map((game, index) => (
          <GameTarjeta
            key={game.id}
            game={game}
            horizontal={horizontal}
            index={index} // para cascada de entrada
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GameLista;
