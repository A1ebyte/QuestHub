package com.example.service.sync;

import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final VideojuegoRepository videojuegoRepository;

    public WishlistService(WishlistRepository wishlistRepository, VideojuegoRepository videojuegoRepository) {
        this.wishlistRepository = wishlistRepository;
        this.videojuegoRepository = videojuegoRepository;
    }
    @Transactional
    public String toggleWishlist(UUID userId, Long gameId) {
        Optional<Wishlist> buscarWisList = wishlistRepository.findByUserIdAndVideojuegoIdVideojuegos(userId, gameId);
        if(buscarWisList.isPresent()) {
            wishlistRepository.deleteByUserIdAndVideojuegoIdVideojuegos(userId, gameId);
            return "Eliminado de la Wishlist";
        } else {
            Videojuego videojuego = videojuegoRepository.findById(gameId)
                    .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));

            Wishlist newItem = new Wishlist();
            newItem.setUserId(userId);
            newItem.setVideojuego(videojuego);
            wishlistRepository.save(newItem);
            return "Añadido a la wishlist";
        }
    }
}
