package com.example.external.steam.DTOs;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BundleSteamDTO(
		String name,
		List<BundleInfoDTO>apps,
		Long id
		) {}
