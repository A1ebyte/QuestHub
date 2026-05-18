package com.example.api.controller.DTOs.ofertas;

import java.util.List;

public record BuscadorResponseDTO(
	    List<OfertasBuscadorDTO> ofertas,
	    long total,
	    int totalOfertas
	) {}
