package com.example.external.steam;

import com.example.domain.model.Videojuego;
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
        //videojuego.setCapturaDePantalla(dto.screenshots());
        videojuego.setDescripcionCorta(SteamDecoderDescription.procesarDescripcion(dto.short_description()));
        videojuego.setDescripcion(SteamDecoderDescription.procesarDescripcion(dto.detailed_description()));
        //videojuego.setSteamRatingPercent();
        videojuego.setIdVideojuegos(dto.steam_appid());
        videojuego.setFechaLanzamiento(dto.release_date().coming_soon() == false?DateConversion.fromSteamDate(dto.release_date()
                                                                                                              .date()):null);
        videojuego.setImagenUrl(dto.header_image());
        videojuego.setImagenUrlResolucionBaja(dto.capsule_image());
        return videojuego;
    }
}
