package com.example.service.sync;
import com.example.service.ServiceOferta;

import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.stereotype.Service;
import com.example.external.cheapshark.CheapSharkClient;

@Service
public class SyncService {

    private final CheapSharkClient cheapSharkClient;
    private final ServiceOferta serviceOferta;
    private final AtomicBoolean syncRunning = new AtomicBoolean(false);

    
    public SyncService(CheapSharkClient cheapSharkClient, ServiceOferta serviceOferta) {
        this.cheapSharkClient = cheapSharkClient;
        this.serviceOferta = serviceOferta;
    }

    public void syncDeals() {
        if (!syncRunning.compareAndSet(false, true)) {
            System.out.println("Sync ya está en ejecución. Se ignora la nueva petición.");
            return;
        }

        try {
            System.out.println("--- Iniciando Sync de Ofertas ---");
            var deals = cheapSharkClient.FetchAllDeals();
            serviceOferta.tiendaExiste(deals);
            serviceOferta.guardarListaOferta(deals);
            System.out.println("--- Sync de Ofertas Finalizado ---");
        } finally {
            syncRunning.set(false);
        }
    }

    public void syncStore() {
        if (!syncRunning.compareAndSet(false, true)) {
            System.out.println("Sync ya está en ejecución. Se ignora la nueva petición.");
            return;
        }

        try {
            System.out.println("--- Iniciando Sync de Tiendas ---");
            var store = cheapSharkClient.getStores();
            serviceOferta.guardarListaTienda(store);
            System.out.println("--- Sync de Tiendas Finalizado ---");
        } finally {
            syncRunning.set(false);
        }
    }
}

