package com.example.api.controller.DTOs.bundle;

import java.util.Set;

import com.example.api.controller.DTOs.videojuego.CapturaFront;
import com.example.api.controller.DTOs.videojuego.MovieFront;

public record BundleProductsFront(
		String nombre,
		String imagen,
		String acerca,
	    Set<MovieFront> movies,
	    Set<CapturaFront> capturas
		) {}
