package com.example.api.controller.DTOs;
import java.time.LocalDateTime;
import java.util.List;

public record ViewOfertaFront (
		long steamAppID, 
	    double precioOferta,
	    double ahorro,
	    double ofertaRating,
	    String urlImagen,
	    String titulo,
	    LocalDateTime recent,
	    int reviews,
		List<Long> tiendaIds
        ){}
