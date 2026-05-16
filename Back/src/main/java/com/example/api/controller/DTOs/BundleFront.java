package com.example.api.controller.DTOs;

import java.util.Set;

public record BundleFront(
		long id,
		String nombre,
		String imagen,
		
		Set<BundleProductsFront> productos,
		
		Set<OfertaFront> ofertas
		) 
{}
