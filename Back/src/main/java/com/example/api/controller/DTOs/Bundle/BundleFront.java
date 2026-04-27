package com.example.api.controller.DTOs.Bundle;

import java.util.List;
import java.util.Set;

import com.example.api.controller.DTOs.CapturaFront;
import com.example.api.controller.DTOs.MovieFront;
import com.example.api.controller.DTOs.OfertaFront;
import com.example.external.steam.DTOs.BundleInfoDTO;

public record BundleFront(
		long id,
		String nombre,
		String imagen,
		
		List<BundleInfoDTO> productos,
		
		Set<OfertaFront> ofertas,
	    Set<BundleVideojuegoFront> videojuegos,
	    Set<MovieFront> movies,
	    Set<CapturaFront> capturas
		) 
{}
