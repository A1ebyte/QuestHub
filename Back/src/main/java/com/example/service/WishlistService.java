package com.example.service;

import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ServicioVideojuego servicioVideojuego;
    private final String clave = "re_bbZhDneQ_B6rVMRbmsFpd39YVQ7pzr4aD";

    public WishlistService(WishlistRepository wishlistRepository, ServicioVideojuego servicioVideojuego) {
        this.wishlistRepository = wishlistRepository;
        this.servicioVideojuego = servicioVideojuego;
    }

    @Transactional
    public String toggleWishlist(UUID userId, Long gameId) {
        Optional<Wishlist> buscarWisList = wishlistRepository.findByUserIdAndVideojuegoIdVideojuego(userId, gameId);

        if (buscarWisList.isPresent()) {
            wishlistRepository.delete(buscarWisList.get());
            return "Eliminado de la Wishlist";

        } else {
            Videojuego videojuego = servicioVideojuego.buscarPorId(gameId);
            Wishlist newItem = new Wishlist();
            newItem.setUserId(userId);
            newItem.setVideojuego(videojuego);
            wishlistRepository.save(newItem);
            return "Añadido a la wishlist";
        }
    }

    public List<Wishlist> obtenerFavoritosPorUsuario(UUID userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
