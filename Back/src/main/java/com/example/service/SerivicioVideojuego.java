package com.example.service;


import com.example.domain.model.Captura;
import com.example.domain.model.Genero;
import com.example.domain.model.Movie;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.CapturaRepository;
import com.example.domain.repository.GeneroRepository;
import com.example.domain.repository.MovieRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamClient;
import com.example.external.steam.SteamMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SerivicioVideojuego {
    private final VideojuegoRepository videojuegoRepository;
    private final SteamClient steamClient;
    private final GeneroRepository generoRepository;
    private final MovieRepository movieRepository;
    private final CapturaRepository capturaRepository;
    public SerivicioVideojuego(VideojuegoRepository videojuegoRepository, SteamClient steamClient, GeneroRepository generoRepository, MovieRepository movieRepository, CapturaRepository capturaRepository) {
        this.videojuegoRepository = videojuegoRepository;
        this.steamClient = steamClient;
        this.generoRepository = generoRepository;
        this.movieRepository = movieRepository;
        this.capturaRepository = capturaRepository;
    }

    public Videojuego buscarPorId (long id) {
        Videojuego juego = videojuegoRepository.findById(id).orElse(null);
        if (juego != null) {
            return juego;
        }

        VideojuegoSteamDTO videojuego = steamClient.getGame(id);
        juego = SteamMapper.toEntity(videojuego);
        for (GenreDTO genre : videojuego.genres()) {
            Genero genero = SteamMapper.toEntity(genre);
            Genero confimacion = generoRepository.findById(genre.id()).orElse(null);
            if(confimacion==null){
                generoRepository.save(genero);
            }
            juego.addGenero(confimacion==null?genero:confimacion);
        }

        for (MovieDTO movie : videojuego.movies()) {
            Movie videos = SteamMapper.toEntity(movie);
            juego.addMovie(videos);
            videos.setVideojuegos(juego);
        }

        for (ScreenshotDTO capturas : videojuego.screenshots()) {
            Captura fotos = SteamMapper.toEntity(capturas);
            juego.addCaptura(fotos);
            fotos.setVideojuegos(juego);
        }
        videojuegoRepository.save(juego);
        return juego;
    }

    public List<Videojuego> buscarPorNombre(String nombre) {
        if(nombre == null) {
            return videojuegoRepository.findAll();
        }
        System.out.println("Entro aqui" + nombre);
        return videojuegoRepository.findByNombreIgnoreCase(nombre);

    }
}
