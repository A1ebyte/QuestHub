package com.example.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.service.sync.SyncService;

@Component
public class StartupRunner implements CommandLineRunner {

	 private final SyncService syncService;

	    public StartupRunner(SyncService syncService) {
	        this.syncService = syncService;
	    }

	    @Override
	    public void run(String... args) {
	        syncService.syncAll();
	    }
}
