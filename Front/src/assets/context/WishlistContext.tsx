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

    const idReal = game.steamAppID || game.idVideojuego;

    if (!idReal) {
      console.error("No se encontró ID en el objeto:", game);
      return;
    }

    const logout = () => {
      setSession(null);
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("wishlist_data");
      window.location.href = "/login";
    };

    try {
      await WishlistService.toggle(idReal, session.access_token);

      setWishlist((prev) => {
        const existe = prev.some(
          (item) => String(item.videojuego.idVideojuego) === String(idReal),
        );
        let nuevaLista;

        if (existe) {
          nuevaLista = prev.filter(
            (item) => String(item.videojuego.idVideojuego) !== String(idReal),
          );
        } else {
          const nuevoItem: Wishlist = {
            id: Date.now(),
            userId: session.user.id,
            videojuego: { ...game, idVideojuego: idReal },
            fechaLanzamiento: new Date().toISOString(),
          };
          nuevaLista = [...prev, nuevoItem];
        }

        // GUARDAMOS EN LA MISMA CLAVE
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(nuevaLista));
        return nuevaLista;
      });
    } catch (error) {
      console.error("Error en toggle:", error);
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
