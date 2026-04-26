package com.example.api.controller.mappers;

import com.example.api.controller.DTOs.CapturaFront;
import com.example.api.controller.DTOs.MovieFront;
import com.example.api.controller.DTOs.OfertaFront;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.Videojuego.VideojuegoBundleFront;
import com.example.api.controller.DTOs.Videojuego.VideojuegoFront;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.Videojuego;
import com.example.service.ServiceOferta;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;


public class FrontMapper {
		
    private static OfertaFront toDTO(Oferta oferta) {        
    	OfertaFront ofertaFront = new OfertaFront(
                oferta.getPrecioOferta(),
                oferta.getPrecioOriginal(),
                oferta.getUrlCompra(),
                oferta.getAhorro(),
                oferta.getThumb(),
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
    
    public static VideojuegoFront toDTO(Videojuego videojuego, ServiceOferta ofertaServ) {
        return new VideojuegoFront(
        	videojuego.getIdVideojuego(),
        	videojuego.getImagenUrl(),
        	videojuego.getImagenUrlResolucionBaja(),
        	videojuego.getNombre(),
        	videojuego.getSteamRatingText(),
        	videojuego.getSteamRatingPercent(),
        	videojuego.getFechaLanzamiento(),
        	videojuego.getDescripcion(),
        	videojuego.getDescripcionCorta(),
        	videojuego.getAcercaDe(),
        	videojuego.getDesarolladores(),
        	videojuego.getDistribuidora(),

        	videojuego.getGeneros().stream()
                .map(genre -> genre.getDescripcion())
                .collect(Collectors.toSet()),

            videojuego.getMovies().stream()
                .map(movie -> new MovieFront(movie.getMiniatura(), movie.getVideo()))
                .collect(Collectors.toSet()),

            videojuego.getCapturas().stream()
                .map(capture -> new CapturaFront(capture.getMiniatura(),capture.getImagen()))
                .collect(Collectors.toSet()),

        	videojuego.getOfertas().stream()
                .map(FrontMapper::toDTO)
                .collect(Collectors.toSet()),

            videojuego.getBundles().stream()
                .map(bundle -> {
                    Double cheapest = ofertaServ.obtenerOfertaMasBarata(bundle.getIdBundle());
                    return new VideojuegoBundleFront(
                        bundle.getIdBundle(),
                        bundle.getNombre(),
                        cheapest
                    );
                })
                .collect(Collectors.toSet())
        );
    }
}

