package com.example.api.controller;

import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.correo.NotificationService;
import com.example.service.ServiceOferta;
import com.example.service.sync.SyncService;
import com.example.service.videojuego.ServicioVideojuego;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test/v1.0")
public class TestController {

    private final SyncService syncService;
    private final NotificationService notificationService;


    public TestController(OfertaRepository ofertaRepository, VideojuegoRepository videojuegoRepository,
                          ServicioVideojuego servicioVideojuego, ServiceOferta serviceOferta, SyncService syncService, NotificationService notificationService) {
        this.syncService = syncService;
		this.notificationService = notificationService;
    }

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
    
    @GetMapping("/notificar")
    public String forceNotifications() {
        notificationService.procesarYEnviarOferta();
        return "Notificaciones forzadas manualmente";
    }
}