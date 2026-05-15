import "./WishListBoton.css";
import { useWishlistContext } from "../../context/WishlistContext";
import React, { useState } from "react";
import { backCaido } from "../../servicios/Axios/http-axios";
import { CORAZON } from "../../const/iconos";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas";

function WishListBoton({ deseado }: { deseado: OfertaTarjetaMostrar }) {
  const { toggleJuego, estaEnWishlist } = useWishlistContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const idParaCheck = deseado.steamAppID
  const enWishlist = estaEnWishlist(idParaCheck);

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing || !idParaCheck) {
      console.error("No se pudo determinar el ID del juego/bundle", deseado);
      return;
    }
    setIsProcessing(true);
    try {
      await toggleJuego(deseado);
    } catch (error) {
      console.error("Error en el botón:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (backCaido) return null;
  else {
    return (
      <div
        className={`wishlist-icon-container ${isProcessing ? "processing" : ""}`}
        onClick={handleAction}
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
