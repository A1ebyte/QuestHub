package com.example.api.controller.DTOs;

public record ToggleWishlistResponse(
	    boolean success,
	    String action,
	    Long id
	) {}
