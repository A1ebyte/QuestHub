package com.example.external.steam.Wrappers;

import com.example.external.steam.DTOs.BundleSteamDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SteamBundleWrapper(
        boolean success,
        BundleSteamDTO data
) {}
