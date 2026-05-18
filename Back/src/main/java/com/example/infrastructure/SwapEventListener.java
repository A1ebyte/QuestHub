package com.example.infrastructure;

import org.springframework.cache.CacheManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class SwapEventListener {
    private final JdbcTemplate jdbcTemplate;
    private final CacheManager cacheManager;

    public SwapEventListener(JdbcTemplate jdbcTemplate, CacheManager cacheManager) {
        this.jdbcTemplate = jdbcTemplate;
        this.cacheManager = cacheManager;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSwapFinished(SwapFinishedEvent event) {

        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ofertas_unicas");
        clearCaches();

        System.out.println("MaterializedView refrescada y caché limpiada");
    }

    private void clearCaches() {
        cacheManager.getCacheNames().forEach(name -> {
            var cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        });
    }
}
