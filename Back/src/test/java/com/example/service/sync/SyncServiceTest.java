package com.example.service.sync;

import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.service.ServiceOferta;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SyncServiceTest {

    @Mock
    CheapSharkClient cheapSharkClient;

    @Mock
    ServiceOferta serviceOferta;

    @InjectMocks
    SyncService syncService;

    @Test
    void syncDeals_shouldCallClientAndService() {

        syncService.syncDeals();

        verify(cheapSharkClient, times(1))
                .fetchAndProcessAllDeals(serviceOferta);
    }

    @Test
    void syncStore_shouldCallClientAndSave() {

        TiendaDTO dto = mock(TiendaDTO.class);

        when(cheapSharkClient.getStores())
                .thenReturn(List.of(dto));

        syncService.syncStore();

        verify(cheapSharkClient, times(1)).getStores();
        verify(serviceOferta, times(1)).guardarListaTienda(List.of(dto));
    }

    @Test
    void syncAll_shouldCallBothServices() {

        when(cheapSharkClient.getStores()).thenReturn(List.of());

        syncService.syncAll();

        verify(cheapSharkClient, times(1)).getStores();
        verify(cheapSharkClient, times(1))
                .fetchAndProcessAllDeals(serviceOferta);
    }
}