package com.example.service.sync;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SyncSchedulerTest {

    @Mock
    SyncService syncService;

    @InjectMocks
    SyncScheduler syncScheduler;

    @Test
    void syncOffers_shouldCallSyncDeals() {

        syncScheduler.syncOffers();

        verify(syncService, times(1)).syncDeals();
    }

    @Test
    void syncOffers_shouldHandleException() {

        doThrow(new RuntimeException("error"))
                .when(syncService).syncDeals();

        syncScheduler.syncOffers();

        verify(syncService, times(1)).syncDeals();
    }

    @Test
    void syncStores_shouldCallSyncStore() {

        syncScheduler.syncStores();

        verify(syncService, times(1)).syncStore();
    }

    @Test
    void syncStores_shouldHandleException() {

        doThrow(new RuntimeException("error"))
                .when(syncService).syncStore();

        syncScheduler.syncStores();

        verify(syncService, times(1)).syncStore();
    }
}