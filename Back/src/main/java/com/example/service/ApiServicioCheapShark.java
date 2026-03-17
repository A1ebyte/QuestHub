package com.example.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.model.DTO.TiendaDTO;

@Service
public class ApiServicioCheapShark {

	private final RestClient restClient;
	
    public ApiServicioCheapShark(@Qualifier("restClientCheapShark") RestClient restClient) {this.restClient = restClient;}

    public TiendaDTO[] getStores() {
    	return restClient
    			.get()
    			.uri("stores")
    			.retrieve()
    			.body(TiendaDTO[].class);
    }
    
    public Map<?, ?> getStoresLastUpdate() {
    	return restClient
    			.get()
    			.uri("stores?lastChange")
    			.retrieve()
    			.body(Map.class);
    }
}

