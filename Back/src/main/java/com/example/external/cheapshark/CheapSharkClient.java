package com.example.external.cheapshark;

import java.util.ArrayList;
//import java.util.HashSet;
import java.util.List;
//import java.util.Set;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
//import com.example.util.SortBy;
import com.example.util.TypeRefs;

@Service
public class CheapSharkClient {

	private final RestClient restClient;
    private final AsyncCheapSharkClient asyncService;

	public CheapSharkClient(@Qualifier("restClientCheapShark") RestClient restClient, AsyncCheapSharkClient asyncService) {
		this.restClient = restClient;
		this.asyncService=asyncService;
	}

	// esta seria para actualizar datos, usarse cada 8h (con @Scheduled)
	public List<OfertaDTO> FetchAllDeals() {
		long totalStart = System.currentTimeMillis();

		ResponseEntity<List<OfertaDTO>> dealsPag0 = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", 0).build()).retrieve()
				.toEntity(TypeRefs.LIST_OF_OFERTAS);
		
		List<OfertaDTO> firstPage = dealsPag0.getBody().stream().filter(d -> !isDLC(d)).toList();

		String totalPagesHeader = dealsPag0.getHeaders().getFirst("X-Total-Page-Count");  // Leer el header
		int totalPages = totalPagesHeader != null ? Integer.parseInt(totalPagesHeader) : 1;
		
		List<CompletableFuture<List<OfertaDTO>>> futures = new ArrayList<>();

		for (int page = 1; page < totalPages; page++) {
			futures.add(asyncService.fetchPage(page,totalPages));
		}
		
		System.out.println("Esperando a que terminen todas las páginas...");
		CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join(); // Esperar a que todos terminen (ignorar el 0)
		System.out.println("Todas las páginas completadas.");																			

		List<OfertaDTO> otherPages = new ArrayList<>();

		for (CompletableFuture<List<OfertaDTO>> future : futures) {
			List<OfertaDTO> pageDeals = future.join(); // ya no bloquea porque allOf() terminó
			otherPages.addAll(pageDeals);
		}
		
        List<OfertaDTO> finalList = new ArrayList<>(firstPage);
        finalList.addAll(otherPages);
        
        long totalEnd = System.currentTimeMillis();
        long totalDuration = totalEnd - totalStart;

        System.out.println("Importación completada en " + (totalDuration / 1000.0) + " segundos");
        
        return finalList;
	}

	public List<TiendaDTO> getStores() {
		List<TiendaDTO> tiendas = restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
		return tiendas.stream().filter(t-> t.isActive()==true).toList(); //para devolver solo las tiendas activas/que siguen
	}

	public static boolean isDLC(OfertaDTO deal) {
		return deal.steamAppID() == null || deal.steamAppID().isBlank();
	}
	
	/*public List<OfertaDTO> top10Deals(SortBy type) {
		List<OfertaDTO> deals = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("sortBy", type).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);

		Set<String> seen = new HashSet<>();

		return deals.stream().filter(d -> !isDLC(d)) // quitar DLC
				.filter(d -> seen.add(d.gameID())) // quitar duples
				.limit(10) // limite
				.toList(); // hacerlo lista
	}*/
}
