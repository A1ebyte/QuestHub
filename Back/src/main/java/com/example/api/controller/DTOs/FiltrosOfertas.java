package com.example.api.controller.DTOs;

import java.time.LocalDateTime;
import java.util.List;

import com.example.util.Enums.OfferTier;

public record FiltrosOfertas(
	    String titulo, 
	    Double minPrecio, 
	    Double maxPrecio, 
	    Double minAhorro, 
	    List<OfferTier> tiers,
	    Integer minReviews, 
	    LocalDateTime inicioOferta, 
	    List<Long> tiendaIds
	){}

