package com.example.util;

import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.external.steam.Wrappers.SteamBundleWrapper;
import com.example.external.steam.Wrappers.SteamJuegoWrapper;
import com.example.util.Enums.OfferTier;

public class TypeRefs {
	public static final ParameterizedTypeReference<List<OfertaDTO>> 
		LIST_OF_OFERTAS = new ParameterizedTypeReference<>() {};

	public static final ParameterizedTypeReference<List<TiendaDTO>>
		LIST_OF_TIENDAS = new ParameterizedTypeReference<>() {};
		
	public static final ParameterizedTypeReference<Map<String, SteamJuegoWrapper>>
        STEAM_JUEGO_DATA = new ParameterizedTypeReference<>() {};
        
    public static final ParameterizedTypeReference<Map<String, SteamBundleWrapper>>
        STEAM_BUNDLE_DATA = new ParameterizedTypeReference<>() {};
        
    public static final List<String> CAMPOS_SORT_OFERTAS = List.of("precioOferta", "ahorro", "ofertaRating", "recent", "reviews", "titulo");
        
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
	
	public static record TierInfo(double min, double max, String text) {}
	
    public static final Map<OfferTier,TierInfo> TIERS = Map.of(
    	    OfferTier.MYTHIC, new TierInfo(9.5, 10, "Mythic"),
    	    OfferTier.EPIC, new TierInfo(8.5, 9.49, "Epic"),
    	    OfferTier.RARE, new TierInfo(7.5, 8.49, "Elite"),
    	    OfferTier.STANDARD, new TierInfo(6.5, 7.49, "Standard"),
    	    OfferTier.BASIC, new TierInfo(0, 6.49, "Basic")
    	);
}
