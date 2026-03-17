package com.example.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiServicioRawg {

	private final RestClient restClient;
	
	@Value("${rawg.api.key}")
	private String rawgApiKey;
	
    public ApiServicioRawg(@Qualifier("restClientRawg") RestClient restClient) {this.restClient = restClient;}

    public String getStores() {
    	return restClient
    			.get()
    			.uri("genres?key={key}", rawgApiKey)
    			.retrieve()
    			.body(String.class);
    }
}
