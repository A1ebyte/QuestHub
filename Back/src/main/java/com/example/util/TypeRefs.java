package com.example.util;

import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.external.steam.SteamWrapper;

public class TypeRefs {
	public static final ParameterizedTypeReference<List<OfertaDTO>> 
		LIST_OF_OFERTAS = new ParameterizedTypeReference<>() {};

	public static final ParameterizedTypeReference<List<TiendaDTO>>
		LIST_OF_TIENDAS = new ParameterizedTypeReference<>() {};
		
	public static final ParameterizedTypeReference<Map<String, SteamWrapper>>
        STEAM_DATA = new ParameterizedTypeReference<>() {};

	public static String steamReviewText(double steamRating) {
		if(steamRating <= 19) {
			return "Extremadamente negativas";
		}
		if(steamRating <= 39) {
			return "Negativas";
		}

		if(steamRating <= 69) {
			return "Variadas";
		}

		if(steamRating <= 79) {
			return "Positiva";
		}

		return "Extremadamente positivas";
	}
}
