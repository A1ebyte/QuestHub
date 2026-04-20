package com.example.service;

import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final VideojuegoRepository videojuegoRepository;
    private final ServicioVideojuego servicioVideojuego;

    public WishlistService(WishlistRepository wishlistRepository, VideojuegoRepository videojuegoRepository, ServicioVideojuego servicioVideojuego) {
        this.wishlistRepository = wishlistRepository;
        this.videojuegoRepository = videojuegoRepository;
        this.servicioVideojuego = servicioVideojuego;
    }

    @Transactional
    public String toggleWishlist(UUID userId, Long gameId) {
        Optional<Wishlist> buscarWisList = wishlistRepository.findByUserIdAndVideojuegoIdVideojuego(userId, gameId);
        if (buscarWisList.isPresent()) {
            wishlistRepository.deleteByUserIdAndVideojuegoIdVideojuego(userId, gameId);
            return "Eliminado de la Wishlist";
        } else {
            Videojuego videojuego = servicioVideojuego.buscarPorId(gameId);
            if (videojuego == null) {
                throw new RuntimeException("Videojuego no encontrado");
            }

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
