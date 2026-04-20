import { useWishlistContext } from "../context/WishlistContext.tsx";
import DescargarPDFButton from "../servicios/PDF/DescargarPDF.jsx";
import "../estilos/Paginas/WishList.css";
import OfertasLista from "../componentes/OfertaLista/OfertasLista.tsx";

function WishList() {
  const { wishlist } = useWishlistContext(); // hook compartido
  const juegoParaMostrar = wishlist.map((item) => {
    const v = item.videojuego;
    return {
      ...v,
      titulo: v.nombre,
      urlImagen: v.imagenUrl,
      thumb: v.imagenUrl,
      url_imagen: v.imagenUrl,
      headerImage: v.imagenUrl,
      id: v.idVideojuego,
      imagen: v.imagenUrl,
      steamAppID: v.idVideoJuego,
      precio_oferta: 0,
      ahorro: 0,
    };
  });
  return (
    <div className="InicioContenedor">
      <div className="wishlist-header">
        <h1>Mi Wishlist</h1>
        {juegoParaMostrar.length > 0 && (
          <DescargarPDFButton
            juegos={juegoParaMostrar}
            className="boton-descarga"
          />
        )}
      </div>

      {/* Lista de juegos o mensaje vacío */}
      {juegoParaMostrar.length === 0 ? (
        <p className="wishlist-empty">No tienes juegos en tu Wishlist</p>
      ) : (
        <OfertasLista ofertas={juegoParaMostrar} />
      )}
    </div>
  );
}

export default WishList;
