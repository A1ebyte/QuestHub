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
	public CompletableFuture<List<OfertaDTO>> fetchPage(int page, int totalPages) {
		long start = System.currentTimeMillis();

		// Delay para evitar bloqueo, probar luego
		try {
			long delay = page * 100 + (long) (Math.random() * 300);
			Thread.sleep(delay);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		}

		long afterDelay = System.currentTimeMillis();

		List<OfertaDTO> deals = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", page).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);

		if (deals == null)
			deals = List.of();

		List<OfertaDTO> filtered = deals.stream().filter(d -> !ServicioCheapShark.isDLC(d)).toList();

		long end = System.currentTimeMillis();

		System.out.println("Página " + (page+1) + "/" + totalPages + " | delay=" + (afterDelay - start) + " ms"
				+ " | petición=" + (end - afterDelay) + " ms" + " | total=" + (end - start) + " ms" + " ("
				+ filtered.size() + " ofertas)");
		return CompletableFuture.completedFuture(filtered);
	}
}
