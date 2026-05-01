package com.example.api.controller.mappers;

import com.example.api.controller.DTOs.WishlistDTO;
import com.example.domain.model.Bundle;
import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {
    public WishlistDTO toMinimalDTO(Wishlist item) {
        if (item == null) return null;
        if (!item.getVideojuegos().isEmpty()) {
            Videojuego v = item.getVideojuegos().iterator().next();
            return new WishlistDTO(
                    item.getId(),
                    "JUEGO",
                    v.getIdVideojuego(),
                    v.getNombre(),
                    v.getImagenUrl()
            );
        }
        if (!item.getBundles().isEmpty()) {
            Bundle b = item.getBundles().iterator().next();
            return new WishlistDTO(
                    item.getId(),
                    "BUNDLE",
                    b.getIdBundle(),
                    b.getNombre(),
                    b.getImagenUrl()
            );
        }
        return null;
    }
}
