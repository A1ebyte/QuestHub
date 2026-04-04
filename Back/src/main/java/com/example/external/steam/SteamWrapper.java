package com.example.external.steam;

import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SteamWrapper(
        boolean success,
        VideojuegoSteamDTO data
) {}
