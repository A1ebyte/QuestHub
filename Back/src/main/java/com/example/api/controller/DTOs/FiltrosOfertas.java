package com.example.api.controller.DTOs;

import java.time.LocalDateTime;
import java.util.List;

public record FiltrosOfertas(
	    String titulo, 
	    Double minPrecio, 
	    Double maxPrecio, 
	    Double minAhorro, 
	    List<String> tiers,
	    List<String> reviews, 
	    LocalDateTime inicioOferta, 
	    List<Long> tiendaIds
	){}