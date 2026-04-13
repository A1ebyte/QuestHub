package com.example.api.controller.DTOs;
import java.time.LocalDateTime;

public record ViewOfertaFront (
		long steamAppID, 
	    double precioOferta,
	    double ahorro,
	    double ofertaRating,
	    String urlImagen,
	    String titulo,
	    LocalDateTime recent,
	    int reviews
        ){}
