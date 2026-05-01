import { useWishlistContext } from "../context/WishlistContext.tsx";
import "../estilos/Paginas/WishList.css";
import OfertasLista from "../componentes/OfertaLista/OfertasLista.tsx";

function WishList() {
  const { wishlist } = useWishlistContext(); // hook compartido

  console.log("Datos brutos de wishlist:", wishlist);

const juegoParaMostrar = (wishlist || []).map((item) => ({
   ...item,
   id: item.idItem, 
   titulo: item.nombre || "Sin nombre",
   urlImagen: item.imagen,
   precio_oferta: item.precio || 0,
   tipo: item.tipo
}));
  return (
    <div className="InicioContenedor">
      <div className="wishlist-header">
        <h1>Mi Wishlist ({juegoParaMostrar.length})</h1>
      </div>

      {juegoParaMostrar.length === 0 ? (
        <div className="wishlist-empty-container">
          <p className="wishlist-empty">No tienes juegos en tu Wishlist</p>
          <button onClick={() => window.location.reload()}>Actualizar</button>
        </div>
      ) : (
        <OfertasLista ofertas={juegoParaMostrar} />
      )}
    </div>
  );
}

export default WishList;
