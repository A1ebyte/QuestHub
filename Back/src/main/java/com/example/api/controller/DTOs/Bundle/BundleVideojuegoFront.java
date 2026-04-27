package com.example.api.controller.DTOs.Bundle;

import java.util.Set;

import com.example.api.controller.DTOs.CapturaFront;
import com.example.api.controller.DTOs.MovieFront;

public record BundleVideojuegoFront (
	    long id,
	    String nombre,
	    String acercaDe,
	    Set<MovieFront> movies,
	    Set<CapturaFront> capturas
	) {}