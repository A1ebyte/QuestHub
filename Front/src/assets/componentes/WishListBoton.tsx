import { useWishlistContext } from "../context/WishlistContext";
import React, { useState, useEffect } from "react";
import { Videojuego } from "../modelos/Videojuegos";
import "../estilos/WishListBoton.css";

interface WishListBotonGame {
  game: Videojuego;
}

function WishListBoton({ game }: WishListBotonGame) {
  const { toggleJuego, estaEnWishlist } = useWishlistContext();

  const idParaCheck = game.idVideojuego || game.steamAppID;
  const enWishlist = estaEnWishlist(idParaCheck);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleJuego(game);
  };

  const [timeOutId, setTimeOutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [visible, setVisible] = useState(false);

  const mouseEntra = () => {
    if (!timeOutId) {
      const id = setTimeout(() => {
        setVisible(true);
      }, 1000);
      setTimeOutId(id);
    }
  };

  const mouseSale = () => {
    if (timeOutId) clearTimeout(timeOutId);
    setTimeOutId(null);
    setVisible(false);
  };

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleJuego(game);
  };

  useEffect(() => {
    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [timeOutId]);

  return (
    <div
      className="wishlist-icon-container"
      onClick={toggle}
      onMouseEnter={mouseEntra}
      onMouseLeave={mouseSale} // onMouseOut a veces da problemas, mejor MouseLeave
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`wishlist-icon ${enWishlist ? "active" : ""}`}
      >
        <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
      </svg>
      <span className={`wishlist-tooltip ${visible ? "visible" : ""}`}>
        {enWishlist ? "Quitar de Wishlist" : "Agregar a Wishlist"}
      </span>
    </div>
  );
}

export default WishListBoton;
