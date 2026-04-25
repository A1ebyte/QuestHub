package com.example.external.steam.Wrappers;

import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SteamJuegoWrapper(
        boolean success,
        VideojuegoSteamDTO data
) {}