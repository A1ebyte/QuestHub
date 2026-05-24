import { useState, useEffect, useRef, FormEvent } from "react";
import "./WishList.css";
import OfertasLista from "../../componentes/OfertaLista/OfertasLista";
import { msjsWishlist } from "../../const/mensajesWishlist";
import { enviarNoti, typeToast } from "../../util/notificacionToast";
import { backCaido } from "../../servicios/Axios/http-axios";
import { WishlistService } from "../../servicios/Axios/ServicioWishlist";
import { useAuth } from "../../context/AuthContext";
import { Wishlist } from "../../modelos/Wishlist";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas";

function WishList() {
  const { session, loading, isSynced } = useAuth();
  const [favoritos, SetFavoritos] = useState<Wishlist[]>();

  const favObtener = async () => {
    try {
      const data = await WishlistService.obtenerFavoritos({
        token: session?.access_token || "",
      });
      SetFavoritos(data.content);
      console.log(data);
    } catch (err) {
      console.error("Error cargando wishlist:", err);
    }
  };

  useEffect(() => {
    if (backCaido) return;
    if (session) {
      favObtener();
    }
  }, []);

  const [mensajeCargado, setMensajeCargado] = useState(false);
  const [wishlistMsj, setWishlistMsj] = useState<any>(null);

  // ── ESTADOS DEL BUSCADOR LOCAL ──
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtroAplicado, setFiltroAplicado] = useState<string>("");

  const searchRef = useRef<HTMLDivElement>(null);

  const juegoParaMostrar = favoritos?.map((item) => ({
    steamAppID: item.id,
    titulo: item.nombre || "Sin nombre",
    urlImagen: item.imagen,
    onSale: item.onSale,
  }));

  // Clic fuera del buscador para ocultar el dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mensajeCargado) {
      setWishlistMsj(
        msjsWishlist[Math.floor(Math.random() * msjsWishlist.length)],
      );
      setMensajeCargado(true);
    }
  }, [mensajeCargado]);

  // Al enviar el formulario (Presionar Enter o Click en la lupa)
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const buscar = searchQuery.trim();

    if (buscar !== "") {
      if (buscar.length < 3) {
        enviarNoti(
          typeToast.WARN,
          "Petición inválida",
          "Para buscar necesito 3 chars minimo",
        );
      } else {
        setFiltroAplicado(buscar);
        setShowDropdown(false);
      }
    } else {
      setFiltroAplicado("");
    }
  };

  // Limpiar el filtro de búsqueda y ver todo de nuevo
  const limpiarFiltro = () => {
    setSearchQuery("");
    setFiltroAplicado("");
    setShowDropdown(false);
  };

  return (
    <div className="InicioContenedor">
      <div className="WishListMainLayout">
        <div className="header-seccion-juegos">
          <div>
            <h1 className="titulo-principal-pagina">Mi Wishlist</h1>
            <p className="mensaje-pagina">
              <span>{!mensajeCargado ? "" : juegoParaMostrar?.length}</span>{" "}
              {wishlistMsj?.mensj}
            </p>
          </div>

          {/* ── COMPONENTE BUSCADOR (IDÉNTICO AL HEADER) ──
        <div className="wishlist__search-wrapper">
          <form onSubmit={handleSearchSubmit}>
            <div className="hdr__search" ref={searchRef}>
              <input
                className="hdr__search-input"
                type="text"
                placeholder="Buscar en mi wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery && (
                <button type="button" className="wishlist__clear-btn" onClick={limpiarFiltro}>
                  ✕
                </button>
              )}

              <button type="submit" className="hdr__search-btn">
                <SearchIcon />
              </button>
            </div>
          </form>
        </div>
       */}
        </div>
        {/* RENDERIZADO DE LAS TARJETAS FILTRADAS */}
        {favoritos?.length == 0 || backCaido ? (
          <div className="wishlist-empty-container">
            <p className="wishlist-empty">
              {backCaido
                ? "Error al conectar a servidores..."
                : filtroAplicado
                  ? `No se encontraron resultados para "${filtroAplicado}"`
                  : "No tienes juegos en tu Wishlist"}
            </p>
            <button onClick={limpiarFiltro}>
              {filtroAplicado ? "Mostrar todos los juegos" : "Actualizar"}
            </button>
          </div>
        ) : (
          <OfertasLista
            ofertas={juegoParaMostrar as OfertaTarjetaMostrar[]}
            wishList={true}
          />
        )}
      </div>
    </div>
  );
}

/* ── Icono SVG Reutilizado ── */
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.017-.984zm-5.44 1.406a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
    </svg>
  );
}

export default WishList;
