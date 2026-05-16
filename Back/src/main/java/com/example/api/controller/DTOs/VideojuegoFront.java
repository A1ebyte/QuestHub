package com.example.api.controller.DTOs;

import java.time.LocalDate;
import java.util.Set;

public record VideojuegoFront(
		long id,
		String imagen,
		String imagenCapsule,
		String nombre,
		String ratingText,
		int rating,
		LocalDate lanzamiento,
		String descripcion,
		String descripcionCorta,
		String acercaDe,
		String desarrolladores,
		String distribuidores,
		
	    Set<String> generos,
	    Set<MovieFront> movies,
	    Set<CapturaFront> capturas,
	    Set<OfertaFront> ofertas
		) {}
