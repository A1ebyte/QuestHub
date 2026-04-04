package com.example.service.sync;
import org.springframework.stereotype.Service;

import com.example.external.cheapshark.CheapSharkClient;

@Service
public class SyncService {

    private final CheapSharkClient cheapSharkClient;
    
    public SyncService(CheapSharkClient cheapSharkClient) {
        this.cheapSharkClient = cheapSharkClient;
    }

    public void syncDeals() {
        //var deals = cheapSharkClient.FetchAllDeals();
        // mapear y guardar en BBDD
    }
}

