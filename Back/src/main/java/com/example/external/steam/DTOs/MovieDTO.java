package com.example.external.steam.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MovieDTO(
        long id,
        String name,
        String thumbnail,
        String dash_av1,
        String hls_h264
) {}