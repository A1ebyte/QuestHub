package com.example.api.controller.DTOs;

import java.util.Set;

public record BundleProductsFront(
		String nombre,
		String imagen,
	    Set<MovieFront> movies,
	    Set<CapturaFront> capturas
		) {}
