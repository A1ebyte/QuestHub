package com.example.api.controller;

import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.steam.SteamClient;
import com.example.service.SerivicioVideojuego;
import com.example.service.ServiceOferta;
import com.example.service.sync.SyncService;
import com.example.util.TypeRefs;

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

	private final SteamClient steamClient;
	private final CheapSharkClient cheapsharkClient;
	private final OfertaRepository ofertaRepository;
	private final TiendaRepository tiendaRepository;
	private final VideojuegoRepository videojuegoRepository;
	private final SerivicioVideojuego serivicioVideojuego;
	private final ServiceOferta serviceOferta;
	private final SyncService syncService;
    
	public TestController(SteamClient servicioSteam, CheapSharkClient servicioCheapShark, OfertaRepository ofertaRepository,
			TiendaRepository tiendaRepository, VideojuegoRepository videojuegoRepository,
			SerivicioVideojuego serivicioVideojuego, ServiceOferta serviceOferta, SyncService syncService) {
		this.steamClient = servicioSteam;
		this.cheapsharkClient = servicioCheapShark;
		this.ofertaRepository = ofertaRepository;
		this.tiendaRepository = tiendaRepository;
		this.videojuegoRepository = videojuegoRepository;
		this.serivicioVideojuego = serivicioVideojuego;
		this.serviceOferta = serviceOferta;
		this.syncService = syncService;
	}

	@GetMapping("/oferta")
	public ResponseEntity<?> getOfertaUpdate() {
		String idABuscar = "%2B7y%2FjZTRXxyTajQx%2FtvBN1%2BoisI6Iv5D7TL9ma6o7lU%3D";
		Oferta oferta = serviceOferta.obtenerOferta(idABuscar);

		if (oferta == null) {
			return ResponseEntity.status(404).body("No se encontró la oferta con ID: " + idABuscar
					+ ". Verifica si el ID en la DB tiene los caracteres % o está limpio.");
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

	// Prueba para: http://localhost:8080/api/Generos
	@GetMapping("/generos")
	public ResponseEntity<?> getFakeGeneros() {
		List<String> generos = List.of("Accion", "RPG", "Indie", "Aventura");
		System.out.println("--> [TEST] Enviando generos mock al Front");
		return ResponseEntity.ok(generos);
	}
	
	@GetMapping("/juego")
	public ResponseEntity<?> getJuego() {
		Videojuego videojuego = serivicioVideojuego.buscarPorId(105600);
		return ResponseEntity.ok(videojuego);
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