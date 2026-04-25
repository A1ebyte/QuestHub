package com.example.external.steam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.Wrappers.SteamBundleWrapper;
import com.example.external.steam.Wrappers.SteamJuegoWrapper;
import com.example.util.TypeRefs;

@Service
public class SteamClient {

	private final RestClient restClient;
	
    public SteamClient(@Qualifier("restClientSteam") RestClient restClient) {this.restClient = restClient;}
    
    public VideojuegoSteamDTO getGame(long id) {
    	Map<String,SteamJuegoWrapper> response = restClient
    			.get()
    			.uri(uriBuilder -> uriBuilder
                        .path("appdetails")
                        .queryParam("appids", id)
                        .queryParam("cc", "es")
                        .queryParam("l", "spanish")
                        .build())
    			.retrieve()
    			.body(TypeRefs.STEAM_JUEGO_DATA);
    	
        SteamJuegoWrapper wrapper = response.get(id+"");

        if (wrapper == null || !wrapper.success()) {
            System.out.println("No es juego");
            return null;
        }
        System.out.println(wrapper.data());
        return wrapper.data();
    }
    
    public BundleSteamDTO getBundle(long id) {
    	Map<String,SteamBundleWrapper> response = restClient
    			.get()
    			.uri(uriBuilder -> uriBuilder
                        .path("packagedetails/")
                        .queryParam("packageids", id)
                        .build())
    			.retrieve()
    			.body(TypeRefs.STEAM_BUNDLE_DATA);
    	
        SteamBundleWrapper wrapper = response.get(id+"");

        if (wrapper == null || !wrapper.success()) {
            System.out.println("Error no existe");
        	return null;
        }
        BundleSteamDTO bundle = new BundleSteamDTO(wrapper.data().name(),wrapper.data().apps() , id);
        System.out.println(bundle);
        return bundle;
    }

}

