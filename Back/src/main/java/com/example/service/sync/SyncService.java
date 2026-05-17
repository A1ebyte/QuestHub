package com.example.service.sync;

import com.example.service.ServiceOferta;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.stereotype.Service;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.DTOs.TiendaDTO;

@Service
public class SyncService {

	private final CheapSharkClient cheapSharkClient;
	private final ServiceOferta serviceOferta;
	private final AtomicBoolean syncDealsRunning = new AtomicBoolean(false);
	private final AtomicBoolean syncStoreRunning = new AtomicBoolean(false);

	public SyncService(CheapSharkClient cheapSharkClient, ServiceOferta serviceOferta) {
		this.cheapSharkClient = cheapSharkClient;
		this.serviceOferta = serviceOferta;
	}

	public void syncAll() {
	    if (!syncDealsRunning.get() && !syncStoreRunning.get()) {
	    	System.out.println("--- Iniciando Sync Total ---");
			syncStore();
			syncDeals();
			System.out.println("--- Sync Total Finalizado ---");
	    }
	}

	public void syncDeals() {
		if (!syncDealsRunning.compareAndSet(false, true)) {
			System.out.println("Sync ya esta en ejecucion. Se ignora la nueva peticion.");
			return;
		}

		try {
			System.out.println("--- Iniciando Sync de Ofertas ---");
			cheapSharkClient.fetchAndProcessAllDeals(serviceOferta);
			System.out.println("--- Sync de Ofertas Finalizado ---");
		} finally {
			syncDealsRunning.set(false);
		}
	}

	public void syncStore() {
		if (!syncStoreRunning.compareAndSet(false, true)) {
			System.out.println("Sync ya esta en ejecucion. Se ignora la nueva peticion.");
			return;
		}

		try {
			System.out.println("--- Iniciando Sync de Tiendas ---");
			List<TiendaDTO> store = cheapSharkClient.getStores();
			serviceOferta.guardarListaTienda(store);
			System.out.println("--- Sync de Tiendas Finalizado ---");
		} finally {
			syncStoreRunning.set(false);
		}
	}
}
