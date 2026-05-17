package com.example.infrastructure;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class SwapEventListener {
    private final JdbcTemplate jdbcTemplate;

    public SwapEventListener(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSwapFinished(SwapFinishedEvent event) {

        jdbcTemplate.execute(
            "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ofertas_unicas"
        );

        System.out.println("Materialized view refrescada despues del commit");
    }
}
