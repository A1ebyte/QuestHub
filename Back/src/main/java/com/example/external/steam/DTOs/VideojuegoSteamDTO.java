package com.example.external.steam.DTOs;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record VideojuegoSteamDTO(String name, 
		String steam_appid, 
		String detailed_description, 
		String short_description,
		String about_the_game,
		String header_image,
		String capsule_image,
		List<String> developers,
        List<String> publishers,
        List<ScreenshotDTO> screenshots,
        List<MovieDTO> movies,
        ReleaseDateDTO release_date
		) {
}
