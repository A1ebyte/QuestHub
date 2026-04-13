package com.example.service.sync;

import java.time.LocalDateTime;
import java.time.LocalTime;
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
        try {
        	syncService.syncDeals();        	
        } catch (Exception e) {
        	System.out.println(e);
        }
    }

    @Scheduled(cron = "0 0 0 1 * ?") /*fixedRateString = "P30D" no seguro de que funcione*/
    public void syncStores() {
        try {
            syncService.syncStore();
        } catch (Exception e) {
        	System.out.println(e);
        }
    }
    
	/*private void delaySync() {
		long minutes = ThreadLocalRandom.current().nextLong(0, 31);   // 0 a 31 minutos
    	long seconds = ThreadLocalRandom.current().nextLong(1, 60);  // 1 a 59 segundos

    	long delay = minutes * 60000 + seconds * 1000;
    	
    	try { Thread.sleep(delay); } 
    	catch (InterruptedException e) { Thread.currentThread().interrupt(); }

    	System.out.println("Iniciando Sync");
	}*/
}