package com.example.infrastructure;

import jakarta.persistence.EntityManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class AsyncOfertaView {

private EntityManager entityManager;
    
    public AsyncOfertaView(EntityManager entityManager) {
    	this.entityManager=entityManager;
    }

    private final AtomicBoolean refreshing = new AtomicBoolean(false);

	@Transactional
    @Async("viewExecutor")
    public void refreshAsync() {
        if (!refreshing.compareAndSet(false, true)) {
            System.out.println("Vista ya se está refrescando. Se ignora.");
            return;
        }

        try {
            System.out.println("Refrescando vista materializada...");
            entityManager.createNativeQuery("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ofertas_unicas")
              .executeUpdate();
            System.out.println("Vista refrescada.");
        } finally {
            refreshing.set(false);
        }
    }
}
