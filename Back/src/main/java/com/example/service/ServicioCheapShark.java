package com.example.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.TypeRefs;
import com.example.model.OfertaDTO;
import com.example.model.SortBy;
import com.example.model.TiendaDTO;

@Service
public class ServicioCheapShark {

	private final RestClient restClient;

	public ServicioCheapShark(@Qualifier("restClientCheapShark") RestClient restClient) {
		this.restClient = restClient;
	}

	// esta seria para actualizar datos, usarse cada 6h (ver como hacerlo)
	public List<OfertaDTO> deals() {
		ResponseEntity<List<OfertaDTO>> dealsPag0 = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", 0).build()).retrieve()
				.toEntity(TypeRefs.LIST_OF_OFERTAS);

		List<OfertaDTO> totalDeals = dealsPag0.getBody();

		// Leer el header
		String totalPagesHeader = dealsPag0.getHeaders().getFirst("X-Total-Page-Count");

		int totalPages = totalPagesHeader != null ? Integer.parseInt(totalPagesHeader) : 1;

		for (int page = 1; page < totalPages; page++) {
			List<OfertaDTO> dealsGames = new ArrayList<>();
			int currentPage=page;
			List<OfertaDTO> deals = restClient.get()
					.uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", currentPage).build()).retrieve()
					.body(TypeRefs.LIST_OF_OFERTAS);
			
			for (OfertaDTO deal : deals) {
				if (isDLC(deal)) continue; // Saltar DLC
				dealsGames.add(deal);
			}
				
			totalDeals.addAll(dealsGames);
		}

		return totalDeals;
	}

	public List<OfertaDTO> top10Deals(SortBy type) {
		List<OfertaDTO> deals = restClient.get()
				.uri(uriBuilder -> uriBuilder.path("deals").queryParam("sortBy", type).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);

		Set<String> seen = new HashSet<>();
		List<OfertaDTO> result = new ArrayList<>(10);

		for (OfertaDTO deal : deals) {
			if (isDLC(deal))
				continue; // Saltar DLC

			// Si la oferta no estaba guardada
			if (seen.add(deal.gameID())) {
				result.add(deal);
				if (result.size() == 10)
					break;
			}
		}
		return result;
	}

	public List<TiendaDTO> getStores() {
		return restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
	}

	private boolean isDLC(OfertaDTO deal) {
		return deal.steamAppID() == null || deal.steamAppID().isBlank();
	}
}
