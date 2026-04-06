package com.example.api.controller;

import com.example.api.controller.DTOs.OfertaFront;
import com.example.domain.model.Oferta;
import com.example.domain.repository.OfertaRepository;
import com.example.service.ServiceOferta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // Mismo prefijo que usa tu Axios
public class TestController {

    private final OfertaRepository ofertaRepository;
    private final ServiceOferta serviceOferta;

    public TestController(OfertaRepository ofertaRepository, ServiceOferta serviceOferta) {
        this.ofertaRepository = ofertaRepository;
        this.serviceOferta = serviceOferta;
    }

    // Prueba para: http://localhost:8080/api/videojuegos
    @GetMapping("/videojuegos")
    public ResponseEntity<?> getFakeVideojuegos() {
        List<Map<String, Object>> juegos = new ArrayList<>();

        // Creamos un objeto manual que simule tu entidad Videojuego
        Map<String, Object> j1 = new HashMap<>();
        j1.put("idVideojuegos", 105600L);
        j1.put("nombre", "Terraria (Fake Test)");
        j1.put("steamRatingPercent", 98);
        j1.put("imagenUrl", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg");

        juegos.add(j1);

        System.out.println("--> [TEST] Enviando videojuegos mock al Front");
        return ResponseEntity.ok(juegos);
    }

    // Prueba para: http://localhost:8080/api/Generos
    @GetMapping("/Generos")
    public ResponseEntity<?> getFakeGeneros() {
        List<String> generos = List.of("Acción", "RPG", "Indie", "Aventura");
        System.out.println("--> [TEST] Enviando géneros mock al Front");
        return ResponseEntity.ok(generos);
    }

    // Prueba para: http://localhost:8080/api/Plataformas
    @GetMapping("/Plataformas")
    public ResponseEntity<?> getFakePlataformas() {
        List<String> plataformas = List.of("PC", "PS5", "Xbox", "Switch");
        System.out.println("--> [TEST] Enviando plataformas mock al Front");
        return ResponseEntity.ok(plataformas);
    }

    @GetMapping("/ofertas-top")
    public ResponseEntity<?> getMejoresOfertas() {
        // Esto llamará a tu lógica de "buscarGrandesDescuentos"
        return ResponseEntity.ok(ofertaRepository.findAll());
    }
    @GetMapping("/ofertas")
    public Page<OfertaFront> getOfertas(
            //@PageableDefault(size = 10, sort = "ofertaRating", direction = Sort.Direction.DESC)
            Pageable pageable) {

        // Simplemente se lo pasamos al service
        return serviceOferta.paginaDeOfertas(pageable);
    }
}