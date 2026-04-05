package com.example.api.controller;

import com.example.domain.model.*;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.CheapSharkMapper;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.external.steam.SteamClient;
import com.example.service.ServiceOferta;
import com.example.service.SerivicioVideojuego;
import com.example.util.TypeRefs;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {


    private final SteamClient steamClient;
    private final CheapSharkClient cheapsharkClient;
    private final OfertaRepository ofertaRepository;
    private final TiendaRepository tiendaRepository;
    private final VideojuegoRepository videojuegoRepository;
    private final SerivicioVideojuego serivicioVideojuego;
    private final ServiceOferta  serviceOferta;

    public Controller(SteamClient servicioSteam, CheapSharkClient servicioCheapShark, OfertaRepository ofertaRepository,
                      TiendaRepository tiendaRepository,
                      VideojuegoRepository videojuegoRepository, SerivicioVideojuego serivicioVideojuego, ServiceOferta serviceOferta) {
        this.steamClient = servicioSteam;
        this.cheapsharkClient = servicioCheapShark;
        this.ofertaRepository = ofertaRepository;
        this.tiendaRepository = tiendaRepository;
        this.videojuegoRepository = videojuegoRepository;
        this.serivicioVideojuego = serivicioVideojuego;
        this.serviceOferta = serviceOferta;
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
        String idABuscar = "%2B7y%2FjZTRXxyTajQx%2FtvBN1%2BoisI6Iv5D7TL9ma6o7lU%3D";
        Oferta oferta = serviceOferta.obtenerOferta(idABuscar);


        if (oferta == null) {
            return ResponseEntity.status(404)
                    .body("No se encontró la oferta con ID: " + idABuscar +
                            ". Verifica si el ID en la DB tiene los caracteres % o está limpio.");
        }
        Videojuego videojuego = serivicioVideojuego.buscarPorId(105600);



        if (videojuego.getSteamRatingText() == null || videojuego.getSteamRatingText().isBlank()) {
            videojuego.setSteamRatingPercent(oferta.getSteamRating());
            videojuego.setSteamRatingText(TypeRefs.steamReviewText(oferta.getSteamRating()));
        }

        videojuegoRepository.save(videojuego);

        ofertaRepository.save(oferta);
        return ResponseEntity.ok(oferta);
    }
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
