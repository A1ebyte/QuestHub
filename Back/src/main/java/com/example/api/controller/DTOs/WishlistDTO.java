package com.example.api.controller.DTOs;

public record WishlistDTO(
        Long idWishlist,
        String tipo,
        Long idItem,
        String nombre,
        String imagen
) {
}
