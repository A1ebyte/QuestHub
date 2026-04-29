package com.example.api.controller.DTOs;

public record OfertaFront(
        double precioOferta,
        double precioOriginal,
        String urlCompra,
        double ahorro,
        String urlImagen,
        TiendaFront tienda
) {}
