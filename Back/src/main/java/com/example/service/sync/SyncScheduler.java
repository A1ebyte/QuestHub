package com.example.service.sync;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SyncScheduler {

    private final SyncService syncService;

    public SyncScheduler(SyncService syncService) {
        this.syncService = syncService;
    }

    // Ejecuta cada 8 horas
   @Scheduled(cron = "0 0 */8 * * *", zone = "Europe/Madrid")
    public void syncOffers() {
        try {
        	syncService.syncDeals();        	
        } catch (Exception e) {
        	System.out.println(e);
        }
    }

    @Scheduled(cron = "0 0 0 1 * ?", zone = "Europe/Madrid") /*fixedRateString = "P30D" no seguro de que funcione*/
    @CacheEvict(value = "tiendas", allEntries = true)
    public void syncStores() {
        try {
            syncService.syncStore();
        } catch (Exception e) {
        	System.out.println(e);
        }
    }
}