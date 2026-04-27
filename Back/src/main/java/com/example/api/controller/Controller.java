package com.example.api.controller;

import com.example.api.controller.DTOs.FiltrosOfertas;
import com.example.api.controller.DTOs.TiendaFront;
import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.api.controller.DTOs.Bundle.BundleFront;
import com.example.api.controller.DTOs.Videojuego.VideojuegoFront;
import com.example.domain.model.Bundle;
import com.example.domain.repository.VistaOfertaRepository;
import com.example.exceptions.BadRequestException;
import com.example.service.ServiceBundle;
import com.example.service.ServiceOferta;
import com.example.service.ServicioVideojuego;
import com.example.validation.PageableValidator;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

	@GetMapping("/{id}")
	public ResponseEntity<?> getJuego(@PathVariable(name = "id") long id) {
		VideojuegoFront dato = servicioVideojuego.buscarPorId(id);
		if (dato!=null) {
			Map<String, VideojuegoFront> respuesta = Map.of("Juego", dato);
			return ResponseEntity.ok(respuesta);
		}
		BundleFront data = serviceBundle.buscarPorId(id);
		if(data!=null) {
			Map<String, BundleFront> respuesta = Map.of("Bundle", data);
			return ResponseEntity.ok(respuesta);
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

		PageableValidator.validarPaginacion(pageable);

	    Pageable pageableSeguro = PageableValidator.construirPageableSeguro(pageable);

	    Page<ViewOfertaFront> pagina =
	            serviceOferta.paginaDeOfertasFiltradas(filtros, pageableSeguro);

	    PageableValidator.validarRangoPagina(pagina, pageable.getPageNumber());

	    return pagina;
	}

}
