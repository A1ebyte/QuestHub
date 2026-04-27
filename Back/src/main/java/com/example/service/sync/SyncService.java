package com.example.service.sync;
import com.example.service.ServiceOferta;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.stereotype.Service;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.infrastructure.AsyncOfertaView;

@Service
public class SyncService {

    private final CheapSharkClient cheapSharkClient;
    private final ServiceOferta serviceOferta;
    private final AsyncOfertaView asyncOfertaView;
    private final AtomicBoolean syncRunning = new AtomicBoolean(false);

    
    public SyncService(CheapSharkClient cheapSharkClient, ServiceOferta serviceOferta, AsyncOfertaView asyncOfertaView) {
        this.cheapSharkClient = cheapSharkClient;
        this.serviceOferta = serviceOferta;
        this.asyncOfertaView=asyncOfertaView;
    }
    
    public void syncAll() {
        if (!syncRunning.compareAndSet(false, true)) {
            System.out.println("Sync ya esta en ejecucion. Se ignora la nueva peticion.");
            return;
        }

        try {
            syncStore();
            syncDeals();
        } finally {
            syncRunning.set(false);
        }
    }

    public void syncDeals() {
        System.out.println("--- Iniciando Sync de Ofertas ---");
        cheapSharkClient.fetchAndProcessAllDeals(serviceOferta);
        System.out.println("--- Sync de Ofertas Finalizado ---");
        asyncOfertaView.refreshAsync();
    }


    public void syncStore() {
        System.out.println("--- Iniciando Sync de Tiendas ---");
        List<TiendaDTO> store = cheapSharkClient.getStores();
        serviceOferta.guardarListaTienda(store);
        System.out.println("--- Sync de Tiendas Finalizado ---");
    }
}

