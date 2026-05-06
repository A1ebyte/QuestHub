import { useWishlistContext } from "../../context/WishlistContext";
import React, { useState, useEffect } from "react";
import { Videojuego } from "../../modelos/Videojuegos";
import "./WishListBoton.css";
import { backCaido } from "../../servicios/Axios/http-axios";
import { CORAZON } from "../../const/iconos";

interface WishListBotonGame {
  game: Videojuego;
}

function WishListBoton({ game }: WishListBotonGame) {
  const { toggleJuego, estaEnWishlist } = useWishlistContext();
  const [isProcessing, setIsProcessing] = useState(false);

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

  if (backCaido) return null;
  else {
    return (
      <div
        className={`wishlist-icon-container ${isProcessing ? "processing" : ""}`}
        onClick={handleAction} // 👈 Usamos la función unificada
        title={ isProcessing ? "Procesando..." : enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"
        }
      >
        <div className={`wishlist-icon ${enWishlist ? "active" : ""}`}>
        {CORAZON}
        </div>
      </div>
    );
  }
}

export default WishListBoton;
