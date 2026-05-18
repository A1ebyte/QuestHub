package com.example.api.controller.DTOs.ofertas;

import com.example.api.controller.DTOs.TiendaFront;

public record OfertaFront(
        double precioOferta,
        double precioOriginal,
        String urlCompra,
        double ahorro,
        String urlImagen,
        TiendaFront tienda
) {}
