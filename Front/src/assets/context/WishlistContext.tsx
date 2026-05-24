import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { WishlistService } from "../servicios/Axios/ServicioWishlist";
// @ts-ignore
import { enviarNoti, typeToast } from "../util/notificacionToast";
import { toastICONS } from "../const/iconos";

interface WishlistContextType {
  wishlist: number[];
  toggleJuego: (deseado: number) => Promise<void>;
  estaEnWishlist: (id: number) => boolean;
  cargarDatos: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, loading, isSynced } = useAuth();

  const [wishlist, setWishlist] = useState<number[]>([]);

  const wishlistIds = useMemo(() => {
    return new Set(wishlist);
  }, [wishlist]);

  const cargarDatos = async () => {
    if (!session?.access_token) return;

    try {
      const data = await WishlistService.obtenerIdsFavoritos(
        session.access_token,
      );

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
    if (!session) {
      setWishlist([]);
    }
  }, [session]);

  const toggleJuego = async (deseado: number | string) => {
    if (!session?.access_token) {
      enviarNoti(
        typeToast.INFO,
        "Inicia Sesion",
        "Para poder usar tu Wishlist",
        toastICONS.ARCADE,
      );
      return;
    }

    const id = Number(deseado);

    const estabaEnLista = wishlistIds.has(id);

    const previous = wishlist;

    if (estabaEnLista) {
      setWishlist((prev) => prev.filter((x) => x !== id));
    } else {
      setWishlist((prev) => [...prev, id]);
    }

    try {
      await WishlistService.toggle(id, session.access_token);
    } catch (error) {
      setWishlist(previous);

      enviarNoti(
        typeToast.ERROR,
        "Error en Wishlist",
        "No se pudo sincronizar con el servidor",
        toastICONS.ARCADE,
      );

      console.error("Error wishlist:", error);
    }
  };

  const estaEnWishlist = (id: number) => {
    return wishlistIds.has(id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleJuego,
        estaEnWishlist,
        cargarDatos,
      }}
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