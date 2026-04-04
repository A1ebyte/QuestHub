package com.example.external.steam.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ReleaseDateDTO(
        boolean coming_soon,
        String date
) {}