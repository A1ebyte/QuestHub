package com.example.external.steam.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ScreenshotDTO(
        int id,
        String path_thumbnail,
        String path_full
) {}
