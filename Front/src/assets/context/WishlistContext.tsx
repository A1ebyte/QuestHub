import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { WishlistService } from "../servicios/Axios/WishlistService";
import { Wishlist } from "../modelos/Wishlist";
import { Videojuego } from "../modelos/Videojuegos";

interface WishlistContextType {
  wishlist: Wishlist[];
  toggleJuego: (game: any) => Promise<void>;
  estaEnWishlist: (id: number | string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_KEY = "wishlist_storage_final";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const cargarDatos = async () => {
      if (!session?.access_token) return;
      try {
        const data = await WishlistService.obtenerFavoritos(
          session.access_token,
        );
        const listaLimpia = Array.isArray(data) ? data : data?.content || [];

        setWishlist(listaLimpia);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(listaLimpia));
      } catch (err) {
        console.error("Error al cargar wishlist:", err);
      }
    };
    cargarDatos();
  }, [session?.access_token]);

  useEffect(() => {
    if (!session) {
      setWishlist([]);
      localStorage.removeItem(WISHLIST_KEY);
    }
  }, [session]);

  const toggleJuego = async (game: any) => {
    if (!session?.access_token) return;

    const idReal = game.idItem || game.idBundle || game.idVideojuego || game.id || game.steamAppID;

  console.log("ID detectado para enviar al backend:", idReal);

    const estabaEnLista = estaEnWishlist(idReal);
    const wishlistPrevia = [...wishlist];

    if (estabaEnLista) {
      setWishlist((prev) =>
        prev.filter((item) => {
          const id = item.idItem || item.id;
          return String(id) !== String(idReal);
        }),
      );
    } else {
      const nuevoItemTemporal: any = {
        dato: game,
        idVideojuego: idReal,
        id: idReal,
      };
      setWishlist((prev) => [...prev, nuevoItemTemporal]);
    }

    try {
      await WishlistService.toggle(idReal, session.access_token);

      // 2. Pedimos la lista actualizada
      const dataActualizada = await WishlistService.obtenerFavoritos(
        session.access_token,
      );
      const listaLimpia = Array.isArray(dataActualizada)
        ? dataActualizada
        : dataActualizada?.content || [];

      // 3. Actualizamos estado y persistencia
      setWishlist(listaLimpia);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(listaLimpia));
    } catch (error) {
      console.error("Error al procesar el botón:", error);
    }
  };
  const estaEnWishlist = (id: number | string) => {
    if (!wishlist || !Array.isArray(wishlist)) return false;
    return wishlist.some((item) => {
      const idEnLista = item.idItem || item.id;
      return String(idEnLista) === String(id);
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleJuego, estaEnWishlist }}>
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
