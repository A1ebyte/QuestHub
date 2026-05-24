package com.example.api.controller.mappers;

import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.bundle.BundleFront;
import com.example.api.controller.DTOs.bundle.BundleProductsFront;
import com.example.api.controller.DTOs.ofertas.OfertaFront;
import com.example.api.controller.DTOs.videojuego.CapturaFront;
import com.example.api.controller.DTOs.videojuego.MovieFront;
import com.example.api.controller.DTOs.videojuego.VideojuegoFront;
import com.example.domain.model.Bundle;
import com.example.domain.model.BundleProductos;
import com.example.domain.model.Captura;
import com.example.domain.model.Movie;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.Videojuego;
import com.example.external.steam.SteamMapper;
import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
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
    
    public static VideojuegoFront toDTO(Videojuego videojuego) {
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
    		    .sorted(Comparator.comparing(Oferta::getPrecioOferta))
    		    .map(FrontMapper::toDTO)
    		    .collect(Collectors.toCollection(LinkedHashSet<OfertaFront>::new));
    	
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
            ofertas
        );
    }
    
    public static BundleFront toDTO(Bundle bundle) {
    	Set<OfertaFront> ofertas = bundle.getOfertas().stream()
    		    .sorted(Comparator.comparing(Oferta::getPrecioOferta))
    		    .map(FrontMapper::toDTO)
    		    .collect(Collectors.toCollection(LinkedHashSet<OfertaFront>::new));
        
        Set<BundleProductsFront> prod =
        	    bundle.getProductos().stream()
        	        .map(p -> new BundleProductsFront(
        	            p.getNombre(),
        	            p.getImagenUrl(),
        	            p.getDescripcion(),
        	            p.getMovies().stream()
        	                .map(movie -> new MovieFront(
        	                    movie.getMiniatura(),
        	                    movie.getVideo()
        	                ))
        	                .collect(Collectors.toSet()),

        	            p.getCapturas().stream()
        	                .map(capture -> new CapturaFront(
        	                    capture.getMiniatura(),
        	                    capture.getImagen()
        	                ))
        	                .collect(Collectors.toSet())
        	        ))
        	        .collect(Collectors.toSet());

        return new BundleFront(bundle.getIdBundle(),bundle.getNombre(),bundle.getImagenUrl(),prod,ofertas);
    }
    
    public static VideojuegoFront toDTO(VideojuegoSteamDTO videojuego, List<Oferta> ofertasDB,String ratingTxt, int rating ) {
    	Videojuego videojuegoFront = SteamMapper.toEntity(videojuego);
    	
    	Set<String> generos=Set.of();
    	if(videojuego.genres()!=null && !videojuego.genres().isEmpty()) {
    	generos = videojuego.genres().stream()
        .map(genre -> SteamMapper.toEntity(genre).getDescripcion())
        .collect(Collectors.toSet());
    	}
    	
    	Set<MovieFront> movies=Set.of();
    	if(videojuego.movies()!=null && !videojuego.movies().isEmpty()) {
    	movies = videojuego.movies().stream()
                .map(movie -> {Movie mov = SteamMapper.toEntity(movie);
                			   return new MovieFront(mov.getMiniatura(),mov.getVideo());})
                .collect(Collectors.toSet());
    	}
    	
    	Set<CapturaFront> capturas = Set.of();
    	if(videojuego.screenshots()!=null && !videojuego.screenshots().isEmpty()) {
    	capturas = videojuego.screenshots().stream()
                .map(capture -> {Captura cap = SteamMapper.toEntity(capture);
                				 return new CapturaFront(cap.getMiniatura(),cap.getImagen());})
                .collect(Collectors.toSet());
    	}
    	
    	Set<OfertaFront> ofertas = Set.of();
    	if (ofertasDB != null) {
    	ofertas = ofertasDB.stream()
    		    .sorted(Comparator.comparing(Oferta::getPrecioOferta))
    		    .map(FrontMapper::toDTO)
    		    .collect(Collectors.toCollection(LinkedHashSet<OfertaFront>::new));
    	}
    	
    	return new VideojuegoFront(
    		videojuegoFront.getIdVideojuego(),
    		videojuegoFront.getImagenUrl(),
    		videojuegoFront.getImagenUrlResolucionBaja(),
    		videojuegoFront.getNombre(),
    		ratingTxt,
    		rating,
    		videojuegoFront.getFechaLanzamiento(),
    		videojuegoFront.getDescripcion(),
    		videojuegoFront.getDescripcionCorta(),
    		videojuegoFront.getAcercaDe(),
    		videojuegoFront.getDesarolladores(),
    		videojuegoFront.getDistribuidora(),

        	generos,
            movies,
            capturas,
            ofertas
        );
    }
    
    public static BundleFront toDTO(BundleSteamDTO bundle, List<Oferta> ofertasDB, Set<BundleProductos> products) {
    	Set<OfertaFront> ofertas = Set.of();
    	if (ofertasDB != null) {
    	ofertas = ofertasDB.stream()
    		    .sorted(Comparator.comparing(Oferta::getPrecioOferta))
    		    .map(FrontMapper::toDTO)
    		    .collect(Collectors.toCollection(LinkedHashSet<OfertaFront>::new));
    	}
        
        Set<BundleProductsFront> prod = Set.of();
        if(products!=null) {
        	    prod = products.stream()
        	        .map(p -> new BundleProductsFront(
        	            p.getNombre(),
        	            p.getImagenUrl(),
        	            p.getDescripcion(),
        	            p.getMovies().stream()
        	                .map(movie -> new MovieFront(
        	                    movie.getMiniatura(),
        	                    movie.getVideo()
        	                ))
        	                .collect(Collectors.toSet()),

        	            p.getCapturas().stream()
        	                .map(capture -> new CapturaFront(
        	                    capture.getMiniatura(),
        	                    capture.getImagen()
        	                ))
        	                .collect(Collectors.toSet())
        	        ))
        	        .collect(Collectors.toSet());
        }

        return new BundleFront(bundle.id(),bundle.name(),bundle.header_image(),prod,ofertas);
    }
}

