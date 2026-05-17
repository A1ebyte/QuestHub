package com.example.external.cheapshark;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.util.TypeRefs;

@Service
public class AsyncCheapSharkClient {
	private final RestClient restClient;

	public AsyncCheapSharkClient(@Qualifier("restClientCheapShark") RestClient restClient) {
		this.restClient = restClient;
	}

	@Async("cheapSharkExecutor")
	public CompletableFuture<List<OfertaDTO>> fetchPages(int page, int totalPages) {
		long start = System.currentTimeMillis();

		long afterDelay = System.currentTimeMillis();
		
		List<OfertaDTO> deals=new ArrayList<>();
		try {

		    deals = restClient.get()
		        .uri(uriBuilder -> uriBuilder
		            .path("deals")
		            .queryParam("pageNumber", page)
		            .build())
		        .retrieve()
		        .body(TypeRefs.LIST_OF_OFERTAS);

		} catch (HttpClientErrorException.TooManyRequests e) {
			
		    String waitingTime = e.getResponseHeaders() != null
		            ? e.getResponseHeaders().getFirst("Retry-After")
		            : null;
		    
		    System.out.println( "429 recibido en pagina " + page 
		    		+ "Esperar: "+ waitingTime);

		    try {
				Thread.sleep(60000);
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}

		    return CompletableFuture.completedFuture(List.of());
		}

		if (deals == null)
			deals = List.of();

		List<OfertaDTO> filtered = deals.stream().filter(d -> !CheapSharkClient.isNotOnSteam(d)).toList();

		long end = System.currentTimeMillis();

		System.out.println("Pagina " + (page+1) + "/" + totalPages + " | delay=" + (afterDelay - start) + " ms"
				+ " | peticion=" + (end - afterDelay) + " ms" + " | total=" + (end - start) + " ms" + " ("
				+ filtered.size() + " ofertas)");
		return CompletableFuture.completedFuture(filtered);
	}
}
