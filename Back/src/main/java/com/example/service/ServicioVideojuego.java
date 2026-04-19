package com.example.service;


import com.example.domain.model.Captura;
import com.example.domain.model.Genero;
import com.example.domain.model.Movie;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.CapturaRepository;
import com.example.domain.repository.GeneroRepository;
import com.example.domain.repository.MovieRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.util.TypeRefs;

import jakarta.transaction.Transactional;

import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioVideojuego {
	private final SteamClient steamClient;
    private final VideojuegoRepository videojuegoRepository;
    private final MovieRepository movieRepository;
    private final GeneroRepository generoRepository;
    private final OfertaRepository ofertaRepository;
    private final CapturaRepository capturaRepository;
    
    public ServicioVideojuego(VideojuegoRepository videojuegoRepository, SteamClient steamClient, GeneroRepository generoRepository, OfertaRepository ofertaRepository, MovieRepository movieRepository, CapturaRepository capturaRepository) {
        this.videojuegoRepository = videojuegoRepository;
		this.movieRepository = movieRepository;
        this.steamClient = steamClient;
        this.generoRepository = generoRepository;
        this.ofertaRepository=ofertaRepository;
		this.capturaRepository = capturaRepository;
    }

    
    public Videojuego buscarPorId (long id) {
        Videojuego juego = videojuegoRepository.findById(id).orElse(null);
        if (juego != null) {
            return juego;
        }
        return createJuego(id);
    }

    public List<Videojuego> buscarPorNombre(String nombre) {
        if(nombre == null) {
            return videojuegoRepository.findAll();
        }
        System.out.println("Entro aqui" + nombre);
        return videojuegoRepository.findByNombreIgnoreCase(nombre);

    }    
    
    @Transactional
   	private Videojuego createJuego(long id) {
   		Videojuego juego;
   		VideojuegoSteamDTO videojuego = steamClient.getGame(id);
           if (videojuego==null) {
           	//para cuando son paquetes/bundles
           	return null;
           }
           juego = SteamMapper.toEntity(videojuego);
           videojuegoRepository.save(juego);

           for (GenreDTO genre : videojuego.genres()) {
           	Genero genero = generoRepository.findById(genre.id())
           	        .orElseGet(() -> generoRepository.save(SteamMapper.toEntity(genre)));

           	juego.addGenero(genero);

           }

           for (MovieDTO movie : videojuego.movies()) {
        	   Movie entity = movieRepository.findById(movie.id())
        			   .orElseGet(() -> movieRepository.save(SteamMapper.toEntity(movie)));
        		juego.addMovie(entity);
           }

           for (ScreenshotDTO capturas : videojuego.screenshots()) {
        	    Captura captura = capturaRepository.findByImagen(capturas.path_full())
        	    		.orElseGet(() -> capturaRepository.save(SteamMapper.toEntity(capturas)));
        	    juego.addCaptura(captura);
        	}

           
   		List<Oferta> lista = ofertaRepository.findBySteamAppID(id);
   		for(Oferta ofer : lista) {
   			juego.addOferta(ofer);
   			if(juego.getSteamRatingText()==null||juego.getSteamRatingText().isEmpty()) {
   				juego.setSteamRatingPercent(ofer.getSteamRating());
   				juego.setSteamRatingText(TypeRefs.steamReviewText(juego.getSteamRatingPercent()));
   			}
   		}
           
           videojuegoRepository.save(juego);
           return juego;
   	}
}
