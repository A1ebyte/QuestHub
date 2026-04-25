package com.example.api.controller;

import com.example.api.controller.DTOs.FiltrosOfertas;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.domain.model.Bundle;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.VideojuegoRepository;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.exceptions.BadRequestException;
import com.example.service.ServiceBundle;
import com.example.service.ServiceOferta;
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
    private final ServiceBundle serviceBundle;
	private final ServicioVideojuego servicioVideojuego;
	private final ServiceOferta serviceOferta;

	public Controller(ServicioVideojuego servicioVideojuego,
			ServiceOferta serviceOferta, VistaOfertaRepository vistaOfertaRepository, ServiceBundle serviceBundle) {
		this.serviceBundle = serviceBundle;
		this.servicioVideojuego = servicioVideojuego;
		this.serviceOferta = serviceOferta;
		this.vistaOfertaRepository = vistaOfertaRepository;
	}

	// todo esto deberia ser con la bbdd
	@GetMapping("/{id}")
	public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
		Videojuego dato = servicioVideojuego.buscarPorId(id);
		if (dato!=null)
			return ResponseEntity.ok(dato);
		Bundle data = serviceBundle.buscarPorId(id);
		if(data!=null) {
			System.out.println(data.getVideojuegos());
			System.out.println(data.getOfertas());
			return ResponseEntity.ok(data);
		}
		return ResponseEntity.notFound().build();
	}
	
	@GetMapping("/mayorPrecio")
	public ResponseEntity<?> getMaxPrecio() {
		Double max=vistaOfertaRepository.findMaxPrecioOferta();
	    if (max == null)
	        throw new BadRequestException("No hay precios disponibles");
	    return ResponseEntity.ok(max);
	}

	@GetMapping("/tiendas")
	public ResponseEntity<?> getTiendasUpdate() {
		List<TiendaFront> tiendas = serviceOferta.getAllTiendas();
	    if (tiendas.isEmpty())
	        throw new BadRequestException("No hay tiendas registradas");
	    return ResponseEntity.ok(tiendas);	}
	
	@GetMapping("/ofertas")
	public Page<ViewOfertaFront> getOfertas(Pageable pageable, FiltrosOfertas filtros) {

	    int page = pageable.getPageNumber();
	    int size = pageable.getPageSize();

	    if (page < 0)
	        throw new BadRequestException("La pagina no puede ser negativa");

	    if (size > 50)
	        throw new BadRequestException("El tamaño maximo permitido es 50");

	    List<Sort.Order> orders = pageable.getSort().toList();

	    if (orders.size() != 1)
	        throw new BadRequestException("Debe enviarse exactamente un par�metro de ordenamiento");

	    Sort.Order order = orders.get(0);
	    String sortBy = order.getProperty();
	    String direction = order.getDirection().name();

	    if (sortBy == null || sortBy.isBlank())
	        throw new BadRequestException("El campo sortBy no puede estar vac�o");

	    if (!TypeRefs.CAMPOS_SORT_OFERTAS.contains(sortBy))
	        throw new BadRequestException("Campo sortBy inv�lido: " + sortBy);

	    if (!direction.equalsIgnoreCase("ASC") && !direction.equalsIgnoreCase("DESC"))
	        throw new BadRequestException("Direcci�n inv�lida: " + direction);

	    Sort sortSeguro = Sort.by(Sort.Direction.fromString(direction), sortBy)
	            .and(Sort.by("steamAppId").ascending());

	    Pageable pageableSeguro = PageRequest.of(page, size, sortSeguro);

	    Page<ViewOfertaFront> pagina = serviceOferta.paginaDeOfertasFiltradas(filtros, pageableSeguro);

	    int totalPages = pagina.getTotalPages();

	    if (totalPages > 0 && page >= totalPages)
	        throw new BadRequestException("La p�gina solicitada est� fuera de rango");

	    return pagina;
	}
	
    @GetMapping("/status")
    public boolean status() {
        return true;
    }

}
