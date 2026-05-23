package com.example.api.controller.DTOs.bundle;

import java.util.Set;

import com.example.api.controller.DTOs.ofertas.OfertaFront;

public record BundleFront(
		long id,
		String nombre,
		String imagen,
		
		Set<BundleProductsFront> productos,
		
		Set<OfertaFront> ofertas
		) 
{}
