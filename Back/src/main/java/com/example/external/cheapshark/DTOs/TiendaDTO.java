package com.example.external.cheapshark.DTOs;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TiendaDTO(
	Long storeID,
	String storeName,
	boolean isActive,
	Map<String, String> images)
{}
