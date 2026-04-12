package com.example.api.controller.mappers;

import com.example.api.controller.DTOs.OfertaFront;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;


public class FrontMapper {
	
    private static OfertaFront toDTO(Oferta oferta) {
        String img=oferta.getUrlImagen().isBlank()?oferta.getThumb():oferta.getUrlImagen();
        
    	OfertaFront ofertaFront = new OfertaFront(
                oferta.getPrecioOferta(),
                oferta.getPrecioOriginal(),
                oferta.getUrlCompra(),
                oferta.getAhorro(),
                img,
                oferta.getTienda().getIdTienda(),
                oferta.getTitulo()
        );

        return ofertaFront;
    }

    public static Page<OfertaFront> toDTOs(Page<Oferta> ofertas) {

        return ofertas.map(FrontMapper::toDTO);
    }
    
    public static TiendaFront toDTO(Tienda tienda) {        
    	TiendaFront tiendaFront = new TiendaFront(
    			tienda.getNombre(),
    			tienda.getLogo(),
    			tienda.getIcon(),
    			tienda.getIdTienda()
        );

        return tiendaFront;
    }
    
    public static List<TiendaFront> toDTOs(List<Tienda> tienda) {        
    	List<TiendaFront> list = new ArrayList<>();
    	for (Tienda tiendaFront : tienda) {
			list.add(toDTO(tiendaFront));
		}
        return list;
    }
}

