package com.example.external.rawg;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RawgClient {

	private final RestClient restClient;
	
	@Value("${rawg.api.key}")
	private String rawgApiKey;
	
    public RawgClient(@Qualifier("restClientRawg") RestClient restClient) {this.restClient = restClient;}

    public String getStores() {
    	return restClient
    			.get()
    			.uri("genres?key={key}", rawgApiKey)
    			.retrieve()
    			.body(String.class);
    }
}
