package com.example.external.steam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.util.TypeRefs;

@Service
public class SteamClient {

	private final RestClient restClient;
	
    public SteamClient(@Qualifier("restClientSteam") RestClient restClient) {this.restClient = restClient;}
    
    public VideojuegoSteamDTO getGame(long id) {
    	Map<String,SteamWrapper> response = restClient
    			.get()
    			.uri(uriBuilder -> uriBuilder
                        .path("appdetails")
                        .queryParam("appids", id)
                        .queryParam("cc", "es")
                        .queryParam("l", "spanish")
                        .build())
    			.retrieve()
    			.body(TypeRefs.STEAM_DATA);
    	
        SteamWrapper wrapper = response.get(String.valueOf(id));

        if (wrapper == null || !wrapper.success()) {
            return null;
        }

        return wrapper.data();
    }

}

