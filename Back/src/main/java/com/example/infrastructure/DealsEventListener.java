package com.example.infrastructure;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
public class DealsEventListener {

    private final AsyncOfertaView asyncOfertaView;

    public DealsEventListener(AsyncOfertaView asyncOfertaView) {
        this.asyncOfertaView = asyncOfertaView;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDealsUpdated(DealsUpdatedEvent event) {
        asyncOfertaView.refreshAsync();
    }
}