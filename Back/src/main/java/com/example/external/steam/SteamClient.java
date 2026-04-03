package com.example.external.steam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.example.model.VideojuegoSteamDTO;

@Service
public class SteamClient {

	private final RestClient restClient;
	
    public SteamClient(@Qualifier("restClientSteam") RestClient restClient) {this.restClient = restClient;}
    
    public VideojuegoSteamDTO getGame(long id) {
    	Map<?,?> response = restClient
    			.get()
    			.uri(uriBuilder -> uriBuilder
                        .path("appdetails")
                        .queryParam("appids", id)
                        .queryParam("cc", "es")
                        .queryParam("l", "spanish")
                        .build())
    			.retrieve()
    			.body(Map.class);
    	
		@SuppressWarnings("unchecked")
		Map<String, Object> existe = (Map<String, Object>)response.get(String.valueOf(id));
        if (existe == null) return null;

        @SuppressWarnings("unchecked")
		Map<String, Object>datos = (Map<String, Object>)existe.get("data");
        if (datos == null) return null;

        return new VideojuegoSteamDTO((String)datos.get("name"),(String)datos.get("type"),(String)datos.get("short_description"));
    }

}

