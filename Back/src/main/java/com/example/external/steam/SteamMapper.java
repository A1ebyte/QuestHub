package com.example.external.steam;

import com.example.domain.model.Captura;
import com.example.domain.model.Genero;
import com.example.domain.model.Movie;
import com.example.domain.model.Videojuego;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.util.DateConversion;
import com.example.util.SteamDecoderDescription;

public class SteamMapper {

    public static Videojuego toEntity(VideojuegoSteamDTO dto) {
        Videojuego videojuego = new Videojuego();

        videojuego.setNombre(dto.name());
        videojuego.setAcercaDe(SteamDecoderDescription.procesarDescripcion(dto.about_the_game()));
        videojuego.setDesarolladores(String.join(",", dto.developers()));
        videojuego.setDistribuidora(String.join(",", dto.publishers()));
        videojuego.setDescripcionCorta(SteamDecoderDescription.procesarDescripcion(dto.short_description()));
        videojuego.setDescripcion(SteamDecoderDescription.procesarDescripcion(dto.detailed_description()));
        videojuego.setIdVideojuegos(dto.steam_appid());
        videojuego.setFechaLanzamiento(dto.release_date().coming_soon() == false?DateConversion.fromSteamDate(dto.release_date()
                                                                                                              .date()):null);
        videojuego.setImagenUrl(dto.header_image());
        videojuego.setImagenUrlResolucionBaja(dto.capsule_image());
        return videojuego;
    }

    public static Genero toEntity(GenreDTO dto) {
        Genero genero = new Genero();
        genero.setIdGenre(dto.id());
        genero.setDescripcion(dto.description());

        return genero;
    }

    public static Movie toEntity(MovieDTO dto) {
        Movie movie = new Movie();
        movie.setIdMovie(dto.id());
        movie.setTitulo(dto.name());
        movie.setMiniatura(dto.thumbnail());
        movie.setVideo(dto.dash_h264());

        return movie;
    }

    public static Captura toEntity(ScreenshotDTO dto) {
        Captura fotos = new Captura();
       fotos.setImagen(dto.path_full());
       fotos.setMiniatura(dto.path_thumbnail());


        return fotos;
    }
}
