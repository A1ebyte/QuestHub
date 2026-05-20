package com.example.api.controller.DTOs;

public record WishlistDTO(
        Long idWishlist,
        Long id,
        String nombre,
        String imagen,
        Boolean onSale
) { 
}
