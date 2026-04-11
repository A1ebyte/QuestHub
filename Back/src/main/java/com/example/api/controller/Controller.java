package com.example.api.controller;

import com.example.api.controller.DTOs.OfertaFront;
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
import com.example.service.sync.SyncService;
import com.example.util.TypeRefs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
	private final ServiceOferta serviceOferta;
	private final SyncService syncService;

	public Controller(SteamClient servicioSteam, CheapSharkClient servicioCheapShark, OfertaRepository ofertaRepository,
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

	// todo esto deberia ser con la bbdd
	@GetMapping("/{id}")
	public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
		return ResponseEntity.ok(steamClient.getGame(id));
	}

	@GetMapping("/tiendas")
	public ResponseEntity<?> getTiendasUpdate() {
		return ResponseEntity.ok(serviceOferta.allTiendas());
	}

	@GetMapping("/ofertas")
	public Page<OfertaFront> getOfertas(Pageable pageable) {
		return serviceOferta.paginaDeOfertas(pageable);
	}

}

/*
 * @GetMapping("/top10") //usamos ? dentro de ResponseEntity para decir que es
 * cualquier cosa public ResponseEntity<?> top10Gamedeals(@RequestParam(required
 * = false,defaultValue = "DealRating",name = "type") String type){ try { SortBy
 * sort = SortBy.valueOf(type); return
 * ResponseEntity.ok(cheapsharkClient.top10Deals(sort)); } catch
 * (IllegalArgumentException e) { return
 * ResponseEntity.badRequest().body("Invalid sortBy value: " + type); } }
 */

/*
 * @GetMapping("/generos") public String getGeneros() { //return
 * rawg.getStores(); }
 */
