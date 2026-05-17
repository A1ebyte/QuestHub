package com.example.external.cheapshark;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.service.ServiceOferta;
import com.example.util.TypeRefs;

@Service
public class CheapSharkClient {

	private final RestClient restClient;
	private final AsyncCheapSharkClient asyncService;

	public CheapSharkClient(@Qualifier("restClientCheapShark") RestClient restClient,
			AsyncCheapSharkClient asyncService) {
		this.restClient = restClient;
		this.asyncService = asyncService;
	}

	public void fetchAndProcessAllDeals(ServiceOferta serviceOferta) {

		LocalDateTime p1 = LocalDateTime.now();
		long totalStart = System.currentTimeMillis();

		ResponseEntity<List<OfertaDTO>> dealsPag0 = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", 0).build()).retrieve()
				.toEntity(TypeRefs.LIST_OF_OFERTAS);

		List<OfertaDTO> firstPage = dealsPag0.getBody().stream().filter(d -> !isNotOnSteam(d)).toList();
		String totalPagesHeader = dealsPag0.getHeaders().getFirst("X-Total-Page-Count");
		int totalPages = totalPagesHeader != null ? Integer.parseInt(totalPagesHeader) : 1;

		System.out.println("Total pages: " + totalPages);

		Set<OfertaDTO> todasLasOfertas = Collections.synchronizedSet(new HashSet<>());

		todasLasOfertas.addAll(firstPage);

		int batchSize = 3;

		System.out.println("Pagina " + 1 + "/" + totalPages + " | delay=" + 0 + " ms" + " | peticion=" + 0 + " ms"
				+ " | total=" + 0 + " ms" + " (" + firstPage.size() + " ofertas)");

		for (int i = 1; i < totalPages; i += batchSize) {

			List<CompletableFuture<Void>> batch = new ArrayList<>();

			for (int j = i; j < i + batchSize && j < totalPages; j++) {

				int pageSync = j;

				CompletableFuture<Void> future = asyncService.fetchPages(pageSync, totalPages).thenAccept(ofertas -> {

					List<OfertaDTO> filtradas = ofertas.stream().filter(d -> !isNotOnSteam(d)).toList();
					todasLasOfertas.addAll(filtradas);
				}).exceptionally(ex -> {
					System.err.println("Error descargando pagina " + pageSync + ": " + ex.getMessage());
					return null;
				});

				batch.add(future);

				try {
					Thread.sleep(400 + (long) (Math.random() * 300));
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
				}
			}

			CompletableFuture.allOf(batch.toArray(new CompletableFuture[0])).join();

			try {
				long delay = 2000 + (long) (Math.random() * 2000);

				System.out.println("Esperando " + delay + " ms entre batches");
				Thread.sleep(delay);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}

		serviceOferta.tiendaExiste(todasLasOfertas);

		serviceOferta.guardarPaginasOferta(todasLasOfertas);

		serviceOferta.swapOfertas();

		long totalEnd = System.currentTimeMillis();

		System.out.println("Sync completado en " + ((totalEnd - totalStart) / 1000.0) + " segundos");

		System.out.println("start:" + p1 + " end:" + LocalDateTime.now());

	}

	public List<TiendaDTO> getStores() {
		List<TiendaDTO> tiendas = restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
		return tiendas.stream().filter(t -> t.isActive() == true).toList(); // para devolver solo las tiendas
																			// activas/que siguen
	}

	public static boolean isNotOnSteam(OfertaDTO deal) {
		return deal.steamAppID() == null || deal.steamAppID().isBlank();
	}

	public TiendaDTO getStore(long id) {
		List<TiendaDTO> tiendas = restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
		Optional<TiendaDTO> tienda = tiendas.stream().filter(t -> t.isActive() == true && t.storeID() == id)
				.findFirst();
		if (tienda.isPresent()) {
			return tienda.get();
		}
		return null;
	}

	public List<OfertaDTO> obtenerOfertasJuego(long id) {
		List<OfertaDTO> deals = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("steamAppID", id).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);

		return deals.stream().filter(d -> d.isOnSale() == 1).toList();
	}
}
