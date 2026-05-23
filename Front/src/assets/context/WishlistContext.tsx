import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { WishlistService } from "../servicios/Axios/ServicioWishlist";
import { Wishlist } from "../modelos/Wishlist";
// @ts-ignore
import { enviarNoti, typeToast } from "../util/notificacionToast";
import { toastICONS } from "../const/iconos";
import { OfertaTarjetaMostrar } from "../modelos/Ofertas";

interface WishlistContextType {
  wishlist: Wishlist[];
  toggleJuego: (deseado: OfertaTarjetaMostrar) => Promise<void>;
  estaEnWishlist: (id: number | string) => boolean;
  cargarDatos():void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_KEY = "wishlist_storage_final";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, loading, isSynced } = useAuth();

  const [wishlist, setWishlist] = useState<Wishlist[]>(() => {
    const saved = sessionStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => String(item.id)));
  }, [wishlist]);

  useEffect(() => {
    sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const cargarDatos = async () => {
    if (!session?.access_token || !isSynced) return;

    try {
      const data = await WishlistService.obtenerFavoritos(session.access_token);

      setWishlist(data);
    } catch (err) {
      console.error("Error cargando wishlist:", err);
    }
  };

  useEffect(() => {
    if (loading || !isSynced) return;
    if (!session?.access_token) return;

    cargarDatos();
  }, [session?.access_token, loading, isSynced]);

  useEffect(() => {
    if (loading || !isSynced) return;

    if (!session) {
      setWishlist([]);
      sessionStorage.removeItem(WISHLIST_KEY);
    }
  }, [session, loading, isSynced]);

  const toggleJuego = async (deseado: OfertaTarjetaMostrar) => {
    if (!session?.access_token) {
      enviarNoti(
        typeToast.INFO,
        "Inicia Sesion",
        "Para poder usar tu Wishlist's",
        toastICONS.ARCADE,
      );
      return;
    }

    const idStr = String(deseado.steamAppID);
    const estabaEnLista = wishlistIds.has(idStr);

    const previousWishlist = wishlist;
    if (estabaEnLista) {
      setWishlist((prev) =>
        prev.filter((item) => String(item.id) !== idStr),
      );
    } else {
      const nuevoItem: Wishlist = {
        id: deseado.steamAppID,
        nombre: deseado.titulo || "Sin nombre",
        imagen: deseado.urlImagen || "",
        idWishlist:"",
        onSale:true
      };

      setWishlist((prev) => [...prev, nuevoItem]);
    }
    try {
      await WishlistService.toggle(deseado.steamAppID, session.access_token);
    } catch (error) {
      setWishlist(previousWishlist);

      enviarNoti(
        typeToast.ERROR,
        "Error en Wishlist",
        "No se pudo sincronizar con el servidor",
        toastICONS.ARCADE,
      );

      console.error("Error wishlist:", error);
    }
  };

  const estaEnWishlist = (id: number | string) => {
    return wishlistIds.has(String(id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleJuego, estaEnWishlist, cargarDatos }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error(
      "useWishlistContext debe usarse dentro de WishlistProvider",
    );
  return context;
};