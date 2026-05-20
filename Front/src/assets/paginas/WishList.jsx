import { useWishlistContext } from "../context/WishlistContext.tsx";
import "../estilos/Paginas/WishList.css";
import OfertasLista from "../componentes/OfertaLista/OfertasLista.tsx";
import { useEffect } from "react";

function WishList() {
  const { wishlist, cargarDatos } = useWishlistContext(); // hook compartido
  useEffect(() => {
    cargarDatos;
  }, []);

  const juegoParaMostrar = (wishlist || []).map((item) => ({
    steamAppID: item.id,
    titulo: item.nombre || "Sin nombre",
    urlImagen: item.imagen,
    onSale: item.onSale
  }));
  return (
    <div className="InicioContenedor">
      <div className="wishlist-header">
        <h1>Mi Wishlist ({juegoParaMostrar.length})</h1>
      </div>

      {juegoParaMostrar.length === 0 ? (
        <div className="wishlist-empty-container">
          <p className="wishlist-empty">No tienes juegos en tu Wishlist</p>
        </div>
      ) : (
        <OfertasLista ofertas={juegoParaMostrar} wishList={true}/>
      )}
    </div>
  );
}

export default WishList;
