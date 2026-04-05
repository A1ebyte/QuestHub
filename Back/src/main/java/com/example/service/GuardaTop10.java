package com.example.service;

import com.example.domain.model.Videojuego;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.util.SortBy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
/*
@Service
public class GuardaTop10 {
    private static final int TOP_N = 10;

    private final CheapSharkClient cheapSharkClient;
    private final VideojuegoRepository videojuegoRepository;

    public GuardaTop10(CheapSharkClient cheapSharkClient, VideojuegoRepository videojuegoRepository){
        this.cheapSharkClient = cheapSharkClient;
        this.videojuegoRepository = videojuegoRepository;
    }

    public void guardarTop10MejoresDeals(){
        System.out.println("DEBUG: Iniciando fetch de la API...");
        List<OfertaDTO> top = cheapSharkClient.FetchAllDeals(SortBy.DealRating, TOP_N);

        System.out.println("DEBUG: Datos recibidos de la API: " + top.size());

        // SI EL FALLO ESTÁ EN EL MAPPER, ESTO NO LLEGARÁ AL FINAL
        List<Videojuego> entidades = top.stream()
                .map(d -> {
                    System.out.println("Mapeando juego: " + d.title());
                    return CheapSharkMapper.toVideojuego(d);
                })
                .toList();

        for (Videojuego videojuego : entidades) {
            videojuegoRepository.save(videojuego);
        }
    }

}


*/
