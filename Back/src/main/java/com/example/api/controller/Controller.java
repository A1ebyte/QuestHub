package com.example.api.controller;

import com.example.api.controller.DTOs.FiltrosOfertas;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.TiendaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.service.ServiceOferta;
import com.example.service.ServiceOferta.BadRequestException;
import com.example.service.ServicioVideojuego;
import com.example.util.TypeRefs;

import java.util.List;

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

    private final VistaOfertaRepository vistaOfertaRepository;
	private final OfertaRepository ofertaRepository;
	private final TiendaRepository tiendaRepository;
	private final VideojuegoRepository videojuegoRepository;
	private final ServicioVideojuego servicioVideojuego;
	private final ServiceOferta serviceOferta;

	public Controller(OfertaRepository ofertaRepository, TiendaRepository tiendaRepository,
			VideojuegoRepository videojuegoRepository, ServicioVideojuego servicioVideojuego,
			ServiceOferta serviceOferta, VistaOfertaRepository vistaOfertaRepository) {
		this.ofertaRepository = ofertaRepository;
		this.tiendaRepository = tiendaRepository;
		this.videojuegoRepository = videojuegoRepository;
		this.servicioVideojuego = servicioVideojuego;
		this.serviceOferta = serviceOferta;
		this.vistaOfertaRepository = vistaOfertaRepository;
	}

	// todo esto deberia ser con la bbdd
	@GetMapping("/{id}")
	public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
		return ResponseEntity.ofNullable(servicioVideojuego.buscarPorId(id));
	}
	
	@GetMapping("/mayorPrecio")
	public ResponseEntity<?> getMaxPrecio() {
		return ResponseEntity.ofNullable(vistaOfertaRepository.findMaxPrecioOferta());
	}

	@GetMapping("/tiendas")
	public ResponseEntity<?> getTiendasUpdate() {
		return ResponseEntity.ok(serviceOferta.allTiendas());
	}
	
	@GetMapping("/ofertas")
	public Page<ViewOfertaFront> getOfertas(Pageable pageable, FiltrosOfertas filtros) {

	    int page = pageable.getPageNumber();
	    int size = pageable.getPageSize();

	    if (page < 0)
	        throw new BadRequestException("La página no puede ser negativa");

	    if (size > 50)
	        throw new BadRequestException("El tamaño máximo permitido es 50");

	    List<Sort.Order> orders = pageable.getSort().toList();

	    if (orders.size() != 1)
	        throw new BadRequestException("Debe enviarse exactamente un parámetro de ordenamiento");

	    Sort.Order order = orders.get(0);
	    String sortBy = order.getProperty();
	    String direction = order.getDirection().name();

	    if (sortBy == null || sortBy.isBlank())
	        throw new BadRequestException("El campo sortBy no puede estar vacío");

	    if (!TypeRefs.CAMPOS_SORT_OFERTAS.contains(sortBy))
	        throw new BadRequestException("Campo sortBy inválido: " + sortBy);

	    if (!direction.equalsIgnoreCase("ASC") && !direction.equalsIgnoreCase("DESC"))
	        throw new BadRequestException("Dirección inválida: " + direction);

	    Sort sortSeguro = Sort.by(Sort.Direction.fromString(direction), sortBy)
	            .and(Sort.by("steamAppId").ascending());

	    Pageable pageableSeguro = PageRequest.of(page, size, sortSeguro);

	    Page<ViewOfertaFront> pagina = serviceOferta.paginaDeOfertasFiltradas(filtros, pageableSeguro);

	    int totalPages = pagina.getTotalPages();

	    if (totalPages > 0 && page >= totalPages)
	        throw new BadRequestException("La página solicitada está fuera de rango");

	    return pagina;
	}
	
    @GetMapping("/status")
    public boolean status() {
        return true;
    }

}
