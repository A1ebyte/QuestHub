package com.example.api.controller;

import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.service.ServicioVideojuego;
import com.example.service.ServiceOferta;
import com.example.service.sync.SyncService;
import com.example.util.TypeRefs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test") // Mismo prefijo que usa tu Axios
public class TestController {

    private final OfertaRepository ofertaRepository;
    private final VideojuegoRepository videojuegoRepository;
    private final ServicioVideojuego servicioVideojuego;
    private final ServiceOferta serviceOferta;
    private final SyncService syncService;

    public TestController(OfertaRepository ofertaRepository, VideojuegoRepository videojuegoRepository,
                          ServicioVideojuego servicioVideojuego, ServiceOferta serviceOferta, SyncService syncService) {
        this.ofertaRepository = ofertaRepository;
        this.videojuegoRepository = videojuegoRepository;
        this.servicioVideojuego = servicioVideojuego;
        this.serviceOferta = serviceOferta;
        this.syncService = syncService;
    }

    // Prueba para: http://localhost:8080/api/Generos
    @GetMapping("/generos")
    public ResponseEntity<?> getFakeGeneros() {
        List<String> generos = List.of("Accion", "RPG", "Indie", "Aventura");
        System.out.println("--> [TEST] Enviando generos mock al Front");
        return ResponseEntity.ok(generos);
    }

    @GetMapping("/sync-ofertas")
    public String forceOfertasSync() {
        syncService.syncDeals();
        return "Sincronizacion iniciada manualmente";
    }

    @GetMapping("/sync-stores")
    public String forceTiendasSync() {
        syncService.syncStore();
        return "Sincronizacion de TIENDAS iniciada correctamente.";
    }

    @GetMapping("/panic")
    public String forcePanicSync() {
        syncService.syncAll();
        return "Sincronizacion de TOTAL iniciada correctamente, ahora a rezar";
    }
}