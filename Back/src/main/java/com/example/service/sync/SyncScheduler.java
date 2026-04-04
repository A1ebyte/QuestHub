package com.example.service.sync;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SyncScheduler {

    private final SyncService syncService;

    public SyncScheduler(SyncService syncService) {
        this.syncService = syncService;
    }

    // Ejecuta cada 8 horas
    @Scheduled(fixedDelay = 8 * 60 * 60 * 1000)
    public void syncOffers() {
    	long minutes = ThreadLocalRandom.current().nextLong(0, 31);   // 0 a 31 minutos
    	long seconds = ThreadLocalRandom.current().nextLong(1, 60);  // 1 a 59 segundos

    	long delay = minutes * 60000 + seconds * 1000;
    	
    	try { Thread.sleep(delay); } 
    	catch (InterruptedException e) { Thread.currentThread().interrupt(); }

    	System.out.println("Iniciando Sync");
    	syncService.syncDeals();
    }
    
    // Ejecuta cada 10 seg
    @Scheduled(fixedDelay = 10000)
    public void test() {
    	System.out.println("PEPE la peua");
    }
}