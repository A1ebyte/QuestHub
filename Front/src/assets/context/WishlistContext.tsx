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
  const { session, setSession } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>(() => {
    const saved = localStorage.getItem("wishlist_persist");
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

  const idReal = game.idVideojuego || game.steamAppID || game.id;

  try {
    const response = await WishlistService.toggle(idReal, session.access_token);
    

    const mensajeServidor = response.mensaje; 

    setWishlist((prev) => {
      if (mensajeServidor === "Eliminado de la Wishlist") {
        const nuevaLista = prev.filter(
          (item) => String(item.videojuego.idVideojuego) !== String(idReal)
        );
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(nuevaLista));
        return nuevaLista;
      } else {
        const nuevoItem = {
          id: Date.now(),
          videojuego: { ...game, idVideojuego: idReal },
        };
        const nuevaLista = [...prev, nuevoItem];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(nuevaLista));
        return nuevaLista;
      }
    });
  } catch (error) {
    console.error("Error al procesar el botón:", error);
  }
};
  const estaEnWishlist = (id: number | string) => {
    if (!wishlist) return false;
    return wishlist.some(
      (item) => String(item.videojuego?.idVideojuego) === String(id),
    );
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
