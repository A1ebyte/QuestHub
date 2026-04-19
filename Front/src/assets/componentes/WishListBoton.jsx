import { useWishlistContext } from "../context/WishlistContext.jsx";
import { useState, useEffect } from "react";
import "../estilos/WishListBoton.css";

function WishlistButton({ game }) {
  const { agregarJuego, quitarJuego, estaEnWishlist } = useWishlistContext();
  const enWishlist = estaEnWishlist(game.id);
  const [timeOutId, setTimeOutId] = useState(null);
  const [visible, setVisible] = useState(false);

  const mouseEntra = () => {
    if (!timeOutId) {
      let id = setTimeout(() => {
        setVisible(true);
      }, 1000);
      setTimeOutId(id);
    }
  };

  const mouseSale = () => {
    clearTimeout(timeOutId);
    setTimeOutId(null);
    setVisible(false);
  };

  const toggle = (e) => {
    e.preventDefault();
    enWishlist ? quitarJuego(game.id) : agregarJuego(game); //POST Y DELETE
  };

  useEffect(() => {
    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [timeOutId]);

  return (
    <div className="wishlist-icon-container" onClick={toggle} onMouseEnter={mouseEntra} onMouseOut={mouseSale}>
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

export default WishlistButton;
