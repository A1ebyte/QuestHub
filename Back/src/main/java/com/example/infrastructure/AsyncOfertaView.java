package com.example.infrastructure;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AsyncOfertaView {

    private final JdbcTemplate jdbcTemplate;

    public AsyncOfertaView(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Async("viewExecutor")
    public void refreshAsync() {
        System.out.println("Refrescando vista...");

        jdbcTemplate.execute(
            "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ofertas_unicas"
        );

        System.out.println("Vista refrescada.");
    }
}
