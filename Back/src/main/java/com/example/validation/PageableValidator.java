package com.example.validation;

import com.example.api.controller.DTOs.ViewOfertaFront;
import com.example.exceptions.BadRequestException;
import com.example.util.TypeRefs;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


public class PageableValidator {
	public static void validarPaginacion(Pageable pageable) {

	    if (pageable.getPageNumber() < 0)
	        throw new BadRequestException("La página no puede ser negativa");

	    if (pageable.getPageSize() > 50)
	        throw new BadRequestException("El size por página máximo permitido es 50");

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
	}

	public static Pageable construirPageableSeguro(Pageable pageable) {

	    Sort.Order order = pageable.getSort().toList().get(0);

	    Sort sortSeguro = Sort.by(
	            Sort.Direction.fromString(order.getDirection().name()),
	            order.getProperty()
	    ).and(Sort.by("steamAppId").ascending());

	    return PageRequest.of(
	            pageable.getPageNumber(),
	            pageable.getPageSize(),
	            sortSeguro
	    );
	}

	public static void validarRangoPagina(Page<ViewOfertaFront> pagina, int pageSolicitada) {

	    int totalPages = pagina.getTotalPages();

	    if (totalPages > 0 && pageSolicitada >= totalPages)
	        throw new BadRequestException("La página solicitada está fuera de rango");
	}
}
