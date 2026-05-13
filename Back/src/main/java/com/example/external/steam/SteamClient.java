package com.example.external.steam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.Wrappers.SteamBundleWrapper;
import com.example.external.steam.Wrappers.SteamJuegoWrapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SteamClient {

	private final RestClient restClient;
	
    public SteamClient(@Qualifier("restClientSteam") RestClient restClient) {this.restClient = restClient;}
    

    public VideojuegoSteamDTO getGame(long id) {

        try {
            String response = restClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("appdetails")
                            .queryParam("appids", id)
                            .queryParam("cc", "es")
                            .queryParam("l", "spanish")
                            .build())
                    .retrieve()
                    .body(String.class);

            System.out.println(response);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, SteamJuegoWrapper> map =
            		objectMapper.readValue(response,
                            new TypeReference<Map<String, SteamJuegoWrapper>>() {});

            SteamJuegoWrapper wrapper = map.get(String.valueOf(id));

            if (wrapper == null || !wrapper.success()) {
                System.out.println("No es juego o Steam devolvió success=false");
                return null;
            }

            return wrapper.data();

        } catch (Exception e) {
            throw new RuntimeException("Error consumiendo Steam appdetails", e);
        }
    }

    public BundleSteamDTO getBundle(long id) {

        try {
            String response = restClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("packagedetails")
                            .queryParam("packageids", id)
                            .build())
                    .retrieve()
                    .body(String.class);

            System.out.println(response);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, SteamBundleWrapper> map =
                    objectMapper.readValue(response,
                            new TypeReference<Map<String, SteamBundleWrapper>>() {});

            SteamBundleWrapper wrapper = map.get(String.valueOf(id));

            if (wrapper == null || !wrapper.success()) {
                System.out.println("Error: bundle no existe o success=false");
                return null;
            }

            return new BundleSteamDTO(
                    wrapper.data().name(),
                    wrapper.data().apps(),
                    id,
                    wrapper.data().header_image()
            );

        } catch (Exception e) {
            throw new RuntimeException("Error consumiendo Steam packagedetails", e);
        }
    }
}

