package com.example.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.service.sync.SyncService;

@Component
public class StartupSyncBBDD implements CommandLineRunner{
	    private final SyncService syncService;

	    public StartupSyncBBDD(SyncService syncService) {
	        this.syncService = syncService;
	    }

	    @Override
	    public void run(String... args) {
	        System.out.println("--- Inicializando sistema ---");
	        syncService.syncAll();
	        System.out.println("--- Sistema listo ---");
	    }
}
