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
//import com.example.util.SortBy;
import com.example.util.TypeRefs;

@Service
public class CheapSharkClient {

    private final RestClient restClient;
    private final AsyncCheapSharkClient asyncService;

    public CheapSharkClient(@Qualifier("restClientCheapShark") RestClient restClient, AsyncCheapSharkClient asyncService) {
        this.restClient = restClient;
        this.asyncService = asyncService;
    }

    // esta seria para actualizar datos, usarse cada 8h (con @Scheduled)
    public void fetchAndProcessAllDeals(ServiceOferta serviceOferta) {
    	LocalDateTime p1=LocalDateTime.now();
        long totalStart = System.currentTimeMillis();

        ResponseEntity<List<OfertaDTO>> dealsPag0 = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("deals").queryParam("pageNumber", 0).build())
                .retrieve()
                .toEntity(TypeRefs.LIST_OF_OFERTAS);

        List<OfertaDTO> firstPage = dealsPag0.getBody().stream()
                .filter(d -> !isDLC(d))
                .toList();

        String totalPagesHeader = dealsPag0.getHeaders().getFirst("X-Total-Page-Count");
        int totalPages = totalPagesHeader != null ? Integer.parseInt(totalPagesHeader) : 1;

        Set<String> idsAcumulados = Collections.synchronizedSet(new HashSet<>());
        serviceOferta.guardarPaginaOferta(firstPage, idsAcumulados);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int page = 1; page < totalPages; page++) 
        {
        	int pageSync=page+1;
        	CompletableFuture<Void> future = asyncService.fetchPages(pageSync, totalPages)
        		    .thenAccept(ofertas -> {
        		        try {
        		            serviceOferta.tiendaExiste(ofertas);
        		            serviceOferta.guardarPaginaOferta(ofertas, idsAcumulados);
        		        } catch (Exception e) {
        		            System.err.println("Error guardando p�gina " + pageSync + ": " + e.getMessage());
        		        }
        		    })
        		    .exceptionally(ex -> {
        		        System.err.println("Error descargando p�gina " + pageSync + ": " + ex.getMessage());
        		        return null;
        		    });
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        serviceOferta.eliminarOfertasAntiguas(idsAcumulados);

        long totalEnd = System.currentTimeMillis();
        System.out.println("Sync completado en " + ((totalEnd - totalStart) / 1000.0) + " segundos");
        System.out.println("star:"+p1+" end:"+LocalDateTime.now());
    }


    public List<TiendaDTO> getStores() {
        List<TiendaDTO> tiendas = restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
        return tiendas.stream().filter(t -> t.isActive() == true).toList(); //para devolver solo las tiendas activas/que siguen
    }

    public static boolean isDLC(OfertaDTO deal) {
        return deal.steamAppID() == null || deal.steamAppID().isBlank();
    }

    public TiendaDTO getStore(long id) {
        List<TiendaDTO> tiendas = restClient.get().uri("stores").retrieve().body(TypeRefs.LIST_OF_TIENDAS);
        Optional<TiendaDTO> tienda = tiendas.stream().filter(t -> t.isActive() == true && t.storeID() == id ).findFirst();
        if (tienda.isPresent()) {
             return tienda.get();
        }
        return null;
    }

    public OfertaDTO obtenerOferta() {
		List<OfertaDTO> deals = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("deals").queryParam("steamAppID", 105600).build()).retrieve()
				.body(TypeRefs.LIST_OF_OFERTAS);



        return deals.get(0);
    }
}
