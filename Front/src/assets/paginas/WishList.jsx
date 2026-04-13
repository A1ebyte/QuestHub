import { useWishlistContext } from "../context/WishlistContext.jsx";
import DescargarPDFButton from "../servicios/PDF/DescargarPDF.jsx";
import "../estilos/Paginas/WishList.css";
import OfertasLista from "../componentes/OfertasLista.jsx";

function WishList() {
  const { wishlist } = useWishlistContext(); // hook compartido

  return (
    <div className="InicioContenedor">
      <div className="wishlist-header">
        <h1>Mi Wishlist</h1>
        {wishlist.length > 0 && (
          <DescargarPDFButton juegos={wishlist} className="boton-descarga" />
        )}
      </div>

      {/* Lista de juegos o mensaje vacío */}
      {wishlist.length === 0 ? (
        <p className="wishlist-empty">No tienes juegos en tu Wishlist</p>
      ) : (
        <OfertasLista ofertas={wishlist}/>
      )}
    </div>
  );
}

export default WishList;
