package com.example.api.controller;

import com.example.domain.model.*;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.steam.SteamClient;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {


    private final SteamClient steamClient;
    private final CheapSharkClient cheapsharkClient;
    private final OfertaRepository ofertaRepository;
    private final TiendaRepository tiendaRepository;
    private final VideojuegoRepository videojuegoRepository;

    public Controller(SteamClient servicioSteam, CheapSharkClient servicioCheapShark, OfertaRepository ofertaRepository,
                      TiendaRepository tiendaRepository,
                      VideojuegoRepository videojuegoRepository) {
        this.steamClient = servicioSteam;
        this.cheapsharkClient = servicioCheapShark;
        this.ofertaRepository = ofertaRepository;
        this.tiendaRepository = tiendaRepository;
        this.videojuegoRepository = videojuegoRepository;
    }

    //todo esto deberia ser con la bbdd
    @GetMapping("/{id}")
    public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
        return ResponseEntity.ok(steamClient.getGame(id));
    }

    @GetMapping("/deals") //usamos ? dentro de ResponseEntity para decir que es cualquier cosa
    public ResponseEntity<?> gamedeals() {
        return ResponseEntity.ok(cheapsharkClient.FetchAllDeals());
    }

    @GetMapping("/tiendas")
    public ResponseEntity<?> getTiendasUpdate() {

        for (TiendaDTO tienda : cheapsharkClient.getStores()) {
            List<Oferta> ofertas = (List<Oferta>) ofertaRepository.findAll();
            Tienda nuevaTienda = CheapSharkMapper.toEntity(tienda);
            nuevaTienda.agregarOfertas(ofertas.getFirst());
            tiendaRepository.save(nuevaTienda);
        }
        return ResponseEntity.ok(tiendaRepository.findAll());
    }


    @GetMapping("/oferta")
    public ResponseEntity<?> getOfertaUpdate() {
        OfertaDTO pepe = cheapsharkClient.obtenerOferta();
        Oferta nuevaOferta = CheapSharkMapper.toEntity(pepe);
        VideojuegoSteamDTO videojuego = steamClient.getGame(Long.valueOf(pepe.steamAppID()));
        Videojuego guardarVideojuego = SteamMapper.toEntity(videojuego);
        for (GenreDTO genre : videojuego.genres()) {
            Genero genero = SteamMapper.toEntity(genre);
            guardarVideojuego.addGenero(genero);
        }

        for (MovieDTO movie : videojuego.movies()) {
            Movie videos = SteamMapper.toEntity(movie);
            guardarVideojuego.addMovie(videos);
            videos.setVideojuegos(guardarVideojuego);
        }

        for (ScreenshotDTO capturas : videojuego.screenshots()) {
            Captura fotos = SteamMapper.toEntity(capturas);
            guardarVideojuego.addCaptura(fotos);
            fotos.setVideojuegos(guardarVideojuego);
        }

        if(guardarVideojuego.getSteamRatingText() == null || guardarVideojuego.getSteamRatingText().isBlank()){
            guardarVideojuego.setSteamRatingPercent(pepe.steamRatingPercent());
            guardarVideojuego.setSteamRatingText(pepe.steamRatingText());
        }
        videojuegoRepository.save(guardarVideojuego);
        nuevaOferta.setTienda(tiendaRepository.findById((long) pepe.storeID()).orElse(null));
        ofertaRepository.save(nuevaOferta);
        return ResponseEntity.ok(nuevaOferta);
    }



    
    /*@GetMapping("/top10") //usamos ? dentro de ResponseEntity para decir que es cualquier cosa
    public ResponseEntity<?> top10Gamedeals(@RequestParam(required = false,defaultValue = "DealRating",name = "type") String type){
    	try {
            SortBy sort = SortBy.valueOf(type);
            return ResponseEntity.ok(cheapsharkClient.top10Deals(sort));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid sortBy value: " + type);
        }    	
    }*/
    
    /*
    @GetMapping("/generos")
    public String getGeneros() {
        //return rawg.getStores();
    }*/
}