package com.example.service;

import com.example.api.controller.DTOs.ofertas.BuscadorResponseDTO;
import com.example.api.controller.DTOs.ofertas.FiltrosOfertas;
import com.example.domain.model.*;
import com.example.domain.repository.*;
import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.cheapshark.DTOs.OfertaDTO;
import com.example.external.cheapshark.DTOs.TiendaDTO;
import com.example.infrastructure.SwapFinishedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceOfertaTest {

    @Mock VideojuegoRepository videojuegoRepository;
    @Mock OfertaRepository ofertaRepository;
    @Mock OfertasStagingRepository ofertaStagingRepository;
    @Mock VistaOfertaRepository vistaOfertaRepository;
    @Mock TiendaRepository tiendaRepository;
    @Mock BundleRepository bundleRepository;
    @Mock CheapSharkClient cheapSharkClient;
    @Mock ApplicationEventPublisher eventPublisher;

    @InjectMocks
    ServiceOferta serviceOferta;

    @Test
    void obtenerOfertasBuscador_shouldCombineResults() {

        VistaOferta v = new VistaOferta();
        v.setSteamAppId(1L);
        v.setTitulo("Game");
        v.setImagen("img");

        Videojuego j = new Videojuego();
        j.setIdVideojuego(2L);
        j.setNombre("Game");
        j.setImagenUrlResolucionBaja("img");

        Bundle b = new Bundle();
        b.setIdBundle(3L);
        b.setNombre("Game");
        b.setImagenUrl("img");

        when(vistaOfertaRepository.findByTituloContainingIgnoreCase("game"))
                .thenReturn(List.of(v));

        when(videojuegoRepository.findByNombreContainingIgnoreCase("game"))
                .thenReturn(List.of(j));

        when(bundleRepository.findByNombreContainingIgnoreCase("game"))
                .thenReturn(List.of(b));

        BuscadorResponseDTO result = serviceOferta.obtenerOfertasBuscador("game");

        assertEquals(3, result.ofertas().size());
    }

    @Test
    void paginaDeOfertas_shouldReturnPage() {

        when(vistaOfertaRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(new VistaOferta())));

        Page<?> result = serviceOferta.paginaDeOfertas(PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void paginaDeOfertasFiltradas_shouldReturnPage() {

        FiltrosOfertas filtros = mock(FiltrosOfertas.class);

        when(filtros.titulo()).thenReturn("game");
        when(filtros.tiendaIds()).thenReturn(List.of(1L));
        when(filtros.tiers()).thenReturn(List.of());
        when(filtros.reviews()).thenReturn(List.of());
        when(filtros.minPrecio()).thenReturn(null);
        when(filtros.maxPrecio()).thenReturn(null);
        when(filtros.minAhorro()).thenReturn(null);
        when(filtros.inicioOferta()).thenReturn(null);

        when(tiendaRepository.findAllIdTienda()).thenReturn(List.of(1L));

        Specification<VistaOferta> spec = any();

        when(vistaOfertaRepository.findAll(spec, any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));

        Page<?> result = serviceOferta.paginaDeOfertasFiltradas(filtros, PageRequest.of(0, 10));

        assertNotNull(result);
    }

    @Test
    void paginaDeOfertasFiltradas_shouldThrowWhenBadPrice() {

        FiltrosOfertas filtros = mock(FiltrosOfertas.class);

        when(filtros.minPrecio()).thenReturn(100.0);
        when(filtros.maxPrecio()).thenReturn(10.0);

        assertThrows(RuntimeException.class,
                () -> serviceOferta.paginaDeOfertasFiltradas(filtros, PageRequest.of(0, 10)));
    }

    @Test
    void getAllTiendas_shouldReturnList() {

        when(tiendaRepository.findAll()).thenReturn(List.of(new Tienda()));

        var result = serviceOferta.getAllTiendas();

        assertEquals(1, result.size());
    }

    @Test
    void obtenerMaxPrecio_shouldReturnValue() {

        when(vistaOfertaRepository.findMaxPrecioOferta()).thenReturn(99.0);

        Double result = serviceOferta.obtenerMaxPrecio();

        assertEquals(99.0, result);
    }

    @Test
    void tiendaExiste_shouldCallRepositoryWhenMissingStores() {

        OfertaDTO dto = mock(OfertaDTO.class);
        when(dto.storeID()).thenReturn(1L);

        when(tiendaRepository.findAllIdTienda()).thenReturn(List.of());

        TiendaDTO api = mock(TiendaDTO.class);
        when(api.storeID()).thenReturn(1L);

        when(cheapSharkClient.getStores()).thenReturn(List.of(api));

        serviceOferta.tiendaExiste(Set.of(dto));

        verify(tiendaRepository).saveAll(any());
    }

    @Test
    void swapOfertas_shouldPublishEvent() {

        serviceOferta.swapOfertas();

        verify(ofertaRepository).truncate();
        verify(ofertaStagingRepository).copyToOferta();
        verify(ofertaStagingRepository).truncate();
        verify(eventPublisher).publishEvent(any(SwapFinishedEvent.class));
    }

    @Test
    void guardarListaTienda_shouldReturnWhenEmptyList() {

        serviceOferta.guardarListaTienda(List.of());

        verify(tiendaRepository, never()).saveAll(any());
        verify(tiendaRepository, never()).deleteByIdTiendaNotIn(any());
    }
}