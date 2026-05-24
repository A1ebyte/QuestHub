import { useState, useEffect, useRef, FormEvent } from "react";
import "./WishList.css";
import OfertasLista from "../../componentes/OfertaLista/OfertasLista";
import { msjsWishlist } from "../../const/mensajesWishlist";
import { backCaido } from "../../servicios/Axios/http-axios";
import { WishlistService } from "../../servicios/Axios/ServicioWishlist";
import { useAuth } from "../../context/AuthContext";
import { Wishlist } from "../../modelos/WishlistMod";
import { OfertaTarjetaMostrar } from "../../modelos/OfertasMod";
import Paginator from "../../componentes/Paginator/Paginator";

function WishList() {
  const { session, isSynced } = useAuth();
  const [favoritos, SetFavoritos] = useState<Wishlist[]>([]);
  const [totalPages, SetTotalPages] = useState<number>(1);
  const [currentPage, SetCurrentPage] = useState<number>(1);
  const [totalElementos, SetTotalElementos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mensajeCargado, setMensajeCargado] = useState(false);
  const [wishlistMsj, setWishlistMsj] = useState("");
  const [wishlistTitulo, setWishlistTitulo] = useState("");

  const searchValue =
    searchQuery.trim().length >= 3 ? searchQuery.trim() : undefined;

  const favObtener = async () => {
    try {
      const data = await WishlistService.obtenerFavoritos({
        token: session?.access_token || "",
        page: currentPage - 1,
        titulo: searchValue,
      });

      if (data.totalPages > 0 && currentPage > data.totalPages) {
        SetCurrentPage(data.totalPages);
        return;
      }
      SetFavoritos(data.content);
      SetTotalPages(data.totalPages);
      SetTotalElementos(data.totalElements);
    } catch (err) {
      console.error("Error cargando wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || backCaido) return;

    const timeout = setTimeout(() => {
      setLoading(true);
      favObtener();
    }, 300);

    if (!mensajeCargado) {
      setMensajeCargado(true);
      const dato =
        msjsWishlist[Math.floor(Math.random() * msjsWishlist.length)];
      setWishlistMsj(dato.mensj);
      setWishlistTitulo(dato.title);
    }

    return () => clearTimeout(timeout);
  }, [searchValue, currentPage, isSynced]);

  const juegoParaMostrar = favoritos?.map((item) => ({
    steamAppID: item.id,
    titulo: item.nombre || "Sin nombre",
    urlImagen: item.imagen,
    onSale: item.onSale,
  }));

  let tituloHeader = "";
  let mensajeHeader = "";
  let totalHeader: number | string = "";

  if (backCaido) {
    tituloHeader = "Servidor no disponible";
    mensajeHeader = "No se pudo conectar con QuestHub.";
  } else if (loading && !mensajeCargado) {
    tituloHeader = "Cargando wishlist...";
    mensajeHeader = "Estamos buscando tu wishlist.";
  } else {
    tituloHeader = wishlistTitulo || "Mi Wishlist";
    mensajeHeader = wishlistMsj || "ofertas disponibles";
    totalHeader = totalElementos || "...";
  }

  return (
    <div className="InicioContenedor">
      <div className="WishListMainLayout">
        <div className="header-seccion-wishlist">
          <div>
            <h1 className="titulo-principal-pagina">{tituloHeader}</h1>
            <p className="mensaje-pagina">
              <span>{totalHeader}</span> {mensajeHeader}
            </p>
          </div>
          <div className="wishlist__search-wrapper">
            <div className="wishlistSearch">
              <input
                className="hdr__search-input"
                type="text"
                placeholder="Buscar en mi wishlist..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchValue) SetCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
        {/* RENDERIZADO DE LAS TARJETAS FILTRADAS */}
        {(favoritos?.length == 0 || backCaido) && !loading ? (
          <div className="wishlist-empty-container">
            <p className="wishlist-empty">
              {backCaido
                ? "Error al conectar a servidores..."
                : searchValue
                  ? `No tienes ningun juego que tenga "${searchValue}" en el titulo`
                  : "No tienes juegos en tu Wishlist"}
            </p>
          </div>
        ) : (
          <>
            <OfertasLista
              loaded={backCaido ? true : !loading}
              ofertas={
                loading || backCaido
                  ? Array(24).fill({})
                  : (juegoParaMostrar as OfertaTarjetaMostrar[])
              }
              wishList={true}
              wishListUpdate={favObtener}
            />
            <div className="paginator-bottom">
              <Paginator
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(p) => SetCurrentPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WishList;
