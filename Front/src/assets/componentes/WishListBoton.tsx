import { useWishlistContext } from "../context/WishlistContext";
import React, { useState, useEffect } from "react";
import { Videojuego } from "../modelos/Videojuegos";
import "../estilos/WishListBoton.css";

interface WishListBotonGame {
  game: Videojuego;
}

function WishListBoton({ game }: WishListBotonGame) {
  const { toggleJuego, estaEnWishlist } = useWishlistContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timeOutId, setTimeOutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const idParaCheck =
(game as any).idItem || 
  (game as any).idBundle || 
  game.idVideojuego || 
  game.id ||              
  game.steamAppID;
  const enWishlist = estaEnWishlist(idParaCheck);

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
if (isProcessing || !idParaCheck) {
    console.error("No se pudo determinar el ID del juego/bundle", game);
    return;
  }
  setIsProcessing(true);
    try {
      await toggleJuego(game);
    } catch (error) {
      console.error("Error en el botón:", error);
    } finally {
      setIsProcessing(false); // Liberamos el botón
    }
  };
  const mouseEntra = () => {
    if (!timeOutId) {
      const id = setTimeout(() => setVisible(true), 1000);
      setTimeOutId(id);
    }
  };

  const mouseSale = () => {
    if (timeOutId) clearTimeout(timeOutId);
    setTimeOutId(null);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [timeOutId]);

  return (
    <div
      className={`wishlist-icon-container ${isProcessing ? "processing" : ""}`}
      onClick={handleAction} // 👈 Usamos la función unificada
      onMouseEnter={mouseEntra}
      onMouseLeave={mouseSale}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`wishlist-icon ${enWishlist ? "active" : ""}`}
      >
        <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
      </svg>
      <span className={`wishlist-tooltip ${visible ? "visible" : ""}`}>
        {isProcessing
          ? "Procesando..."
          : enWishlist
            ? "Quitar de Wishlist"
            : "Agregar a Wishlist"}
      </span>
    </div>
  );
}

export default WishListBoton;
