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
            Videojuego videojuego = servicioVideojuego.buscarPorIdWishList(gameId);
            Wishlist newItem = new Wishlist();
            newItem.setUserId(userId);
            newItem.setVideojuego(videojuego);
            wishlistRepository.save(newItem);
            return "Añadido a la wishlist";
        }
    }

    @Transactional
    public void eliminarItem(UUID userId, Long gameId) {
        Optional<Wishlist> item = wishlistRepository.findByUserIdAndVideojuegoIdVideojuego(userId, gameId);

        if (item.isPresent()) {
            wishlistRepository.delete(item.get());
        } else {
            throw new RuntimeException("El videojuego con ID " + gameId + " no está en la wishlist del usuario.");
        }
    }

    public List<Wishlist> obtenerFavoritosPorUsuario(UUID userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
