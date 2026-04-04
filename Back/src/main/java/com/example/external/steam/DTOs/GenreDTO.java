package com.example.external.steam.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GenreDTO(
        String id,          
        String description
) {}
