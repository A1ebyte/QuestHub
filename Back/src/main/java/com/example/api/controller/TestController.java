package com.example.api.controller;

import com.example.domain.model.Videojuego;
import com.example.service.SerivicioVideojuego;
import com.example.service.sync.SyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test") // Mismo prefijo que usa tu Axios
public class TestController {

    private final SyncService syncService;
    private final SerivicioVideojuego servicioVideojugo;
    
	public TestController(SyncService syncService, SerivicioVideojuego servicioVideojugo) {
		this.syncService = syncService;
		this.servicioVideojugo = servicioVideojugo;
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
	@GetMapping("/generos")
	public ResponseEntity<?> getFakeGeneros() {
		List<String> generos = List.of("Accion", "RPG", "Indie", "Aventura");
		System.out.println("--> [TEST] Enviando generos mock al Front");
		return ResponseEntity.ok(generos);
	}
	
	@GetMapping("/juego")
	public ResponseEntity<?> getJuego() {
		Videojuego videojuego = servicioVideojugo.buscarPorId(105600);
		return ResponseEntity.ok(videojuego);
	}

	@GetMapping("/sync-ofertas")
	public String forceOfertasSync() {
		// Ahora 'this.syncService' ya no será null porque se asignó arriba
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
		syncService.syncStore();
		syncService.syncDeals();
		return "Sincronizacion de TOTAL iniciada correctamente, ahora a rezar";
	}
}