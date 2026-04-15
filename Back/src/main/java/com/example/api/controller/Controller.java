package com.example.api.controller;

import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.service.ServiceOferta;
import com.example.service.ServicioVideojuego;
import com.example.util.TypeRefs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {

	private final OfertaRepository ofertaRepository;
	private final TiendaRepository tiendaRepository;
	private final VideojuegoRepository videojuegoRepository;
	private final ServicioVideojuego servicioVideojuego;
	private final ServiceOferta serviceOferta;

	public Controller(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
			VideojuegoRepository videojuegoRepository, ServicioVideojuego servicioVideojuego,
			ServiceOferta serviceOferta) {
		this.ofertaRepository = ofertaRepository;
		this.tiendaRepository = tiendaRepository;
		this.videojuegoRepository = videojuegoRepository;
		this.servicioVideojuego = servicioVideojuego;
		this.serviceOferta = serviceOferta;
	}

	// todo esto deberia ser con la bbdd
	@GetMapping("/{id}")
	public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
		return ResponseEntity.ofNullable(servicioVideojuego.buscarPorId(id));
	}

	@GetMapping("/tiendas")
	public ResponseEntity<?> getTiendasUpdate() {
		return ResponseEntity.ok(serviceOferta.allTiendas());
	}

	@GetMapping("/ofertas")
	public Page<ViewOfertaFront> getOfertas(Pageable pageable) {
		Sort sort = pageable.getSort();
		Sort sortSeguro = sort.and(Sort.by("steamAppId").ascending());

		Pageable pageableSeguro = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortSeguro);

		return serviceOferta.paginaDeOfertas(pageableSeguro);
	}

}
