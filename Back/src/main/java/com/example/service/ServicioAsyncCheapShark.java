package com.example.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.TypeRefs;
import com.example.model.OfertaDTO;

@Service
public class ServicioAsyncCheapShark {
	private final RestClient restClient;

	public ServicioAsyncCheapShark(@Qualifier("restClientCheapShark") RestClient restClient) {
		this.restClient = restClient;
	}
	
	@Async("cheapSharkExecutor")
	public CompletableFuture<List<OfertaDTO>> fetchPage(int page) {
	    System.out.println("Descargando página " + page + " en hilo: " + Thread.currentThread().getName());
	    
		List<OfertaDTO> deals = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", page).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);

		if (deals == null)
			deals = List.of();

		List<OfertaDTO> filtered = deals.stream().filter(d -> !ServicioCheapShark.isDLC(d)).toList();

		return CompletableFuture.completedFuture(filtered);
	}
}
