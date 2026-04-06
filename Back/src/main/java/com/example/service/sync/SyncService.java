package com.example.service.sync;
import com.example.service.ServiceOferta;
import org.springframework.stereotype.Service;

import com.example.external.cheapshark.CheapSharkClient;

@Service
public class SyncService {

    private final CheapSharkClient cheapSharkClient;
    private final ServiceOferta serviceOferta;
    
    public SyncService(CheapSharkClient cheapSharkClient, ServiceOferta serviceOferta) {
        this.cheapSharkClient = cheapSharkClient;
        this.serviceOferta = serviceOferta;
    }

    public void syncDeals() {
        System.out.println("--- Iniciando Sync de Tiendas ---");
        var deals = cheapSharkClient.FetchAllDeals();
        // mapear y guardar en BBDD
        serviceOferta.guardarListaOferta(deals);
        System.out.println("--- Sync de Tiendas Finalizado ---");
    }

    public void syncStore() {
        System.out.println("--- Iniciando Sync de Ofertas ---");
        var store = cheapSharkClient.getStores();
        serviceOferta.guardarListaTienda(store);
        System.out.println("--- Sync de Ofertas Finalizado ---");
    }
}

