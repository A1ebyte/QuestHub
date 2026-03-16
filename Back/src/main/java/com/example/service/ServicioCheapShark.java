package com.example.service;


import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.model.TiendaDTO;


@Service
public class ServicioCheapShark {

	private final RestClient restClient;
	
    public ServicioCheapShark(RestClient restClient) {
        this.restClient = restClient;
    }

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

