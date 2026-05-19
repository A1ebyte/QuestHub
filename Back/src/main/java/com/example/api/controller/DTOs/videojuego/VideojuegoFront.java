package com.example.api.controller.DTOs.videojuego;

import java.time.LocalDate;
import java.util.Set;

import com.example.api.controller.DTOs.ofertas.OfertaFront;

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
