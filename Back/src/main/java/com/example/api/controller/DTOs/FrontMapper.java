package com.example.api.controller.DTOs;

import com.example.domain.model.Oferta;
import org.springframework.data.domain.Page;

import java.util.List;

public class FrontMapper {
    private static OfertaFront toDTO(Oferta oferta) {
        OfertaFront ofertaFront = new OfertaFront(
                oferta.getPrecioOferta(),
                oferta.getPrecioOriginal(),
                oferta.getUrlCompra(),
                oferta.getAhorro(),
                oferta.getUrlImagen(),
                oferta.getTienda().getIdTienda()
        );


        return ofertaFront;
    }

    public static Page<OfertaFront> toDTOs(Page<Oferta> ofertas) {

        return ofertas.map(FrontMapper::toDTO);
    }
}

