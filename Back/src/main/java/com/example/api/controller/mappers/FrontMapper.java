package com.example.api.controller.mappers;

import com.example.api.controller.DTOs.CapturaFront;
import com.example.api.controller.DTOs.MovieFront;
import com.example.api.controller.DTOs.OfertaFront;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.Bundle.BundleFront;
import com.example.api.controller.DTOs.Bundle.BundleVideojuegoFront;
import com.example.api.controller.DTOs.Videojuego.VideojuegoBundleFront;
import com.example.api.controller.DTOs.Videojuego.VideojuegoFront;
import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.Videojuego;
import com.example.service.ServiceOferta;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
                FrontMapper.toDTO(oferta.getTienda())
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
    	Set<String> generos = videojuego.getGeneros().stream()
        .map(genre -> genre.getDescripcion())
        .collect(Collectors.toSet());
    	
    	Set<MovieFront> movies = videojuego.getMovies().stream()
                .map(movie -> new MovieFront(movie.getMiniatura(), movie.getVideo()))
                .collect(Collectors.toSet());
    	
    	Set<CapturaFront> capturas = videojuego.getCapturas().stream()
                .map(capture -> new CapturaFront(capture.getMiniatura(),capture.getImagen()))
                .collect(Collectors.toSet());
    	
    	Set<OfertaFront> ofertas = videojuego.getOfertas().stream()
                .map(FrontMapper::toDTO)
                .collect(Collectors.toSet());
    	
    	Set<VideojuegoBundleFront> bundle = videojuego.getBundles().stream()
                .map(bund -> {
                    Double cheapest = ofertaServ.obtenerOfertaMasBarata(bund.getIdBundle());
                    return new VideojuegoBundleFront(
                    	bund.getIdBundle(),
                    	bund.getNombre(),
                        cheapest
                    );
                })
                .collect(Collectors.toSet());
    	
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

        	generos,
            movies,
            capturas,
            ofertas,
            bundle
        );
    }
    
    public static BundleFront toDTO(Bundle bundle) {
        Set<BundleVideojuegoFront> videojuegos = bundle.getVideojuegos().stream()
            .map(v -> new BundleVideojuegoFront(
                v.getIdVideojuego(),
                v.getNombre(),
                v.getAcercaDe(),
                v.getMovies().stream()
                    .map(m -> new MovieFront(m.getMiniatura(), m.getVideo()))
                    .collect(Collectors.toSet()),
                v.getCapturas().stream()
                    .map(c -> new CapturaFront(c.getMiniatura(), c.getImagen()))
                    .collect(Collectors.toSet())
            ))
            .collect(Collectors.toSet());

        Set<MovieFront> movies = videojuegos.stream()
            .flatMap(v -> v.movies().stream())
            .collect(Collectors.toSet());

        Set<CapturaFront> capturas = videojuegos.stream()
            .flatMap(v -> v.capturas().stream())
            .collect(Collectors.toSet());

        return new BundleFront(
            bundle.getIdBundle(),
            bundle.getNombre(),
            bundle.getImagenUrl(),
            bundle.getProductos(),

            bundle.getOfertas().stream()
                .map(FrontMapper::toDTO)
                .collect(Collectors.toSet()),

            videojuegos,
            movies,
            capturas
        );
    }
}

