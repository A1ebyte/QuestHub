package com.example.service.videojuego;

import com.example.api.controller.DTOs.videojuego.VideojuegoFront;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamClient;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicioVideojuegoTest {

    @Mock
    VideojuegoRepository videojuegoRepository;

    @Mock
    SteamClient steamClient;

    @Mock
    OfertaRepository ofertaRepository;

    @Mock
    ServiceAsyncVideojuego serviceAsyncVideojuego;

    @InjectMocks
    ServicioVideojuego servicioVideojuego;

    @Test
    void buscarPorId_shouldReturnFromDatabase() {

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);
        juego.setNombre("Elden Ring");

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.of(juego));

        VideojuegoFront result = servicioVideojuego.buscarPorId(1L);

        assertNotNull(result);

        verify(steamClient, never()).getGame(anyLong());
    }

    @Test
    void buscarPorId_shouldReturnNullWhenSteamReturnsNull() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        when(steamClient.getGame(1L))
                .thenReturn(null);

        VideojuegoFront result = servicioVideojuego.buscarPorId(1L);

        assertNull(result);
    }

    @Test
    void buscarPorId_shouldFetchFromSteamAndCallAsyncSave() {

        when(videojuegoRepository.findById((long) 1))
                .thenReturn(Optional.empty());

        VideojuegoSteamDTO steamDto = mock(VideojuegoSteamDTO.class);

        when(steamClient.getGame(1))
                .thenReturn(steamDto);

        Oferta oferta = new Oferta();
        oferta.setSteamRating(90);

        Tienda tienda = new Tienda();
        tienda.setNombre("Steam");

        oferta.setTienda(tienda);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of(oferta));

        VideojuegoFront result = servicioVideojuego.buscarPorId(1);

        assertNotNull(result);

        verify(serviceAsyncVideojuego).guardarJuegoAsync(1);
    }

    @Test
    void buscarPorId_shouldHandleEmptyOffers() {

        when(videojuegoRepository.findById((long) 1))
                .thenReturn(Optional.empty());

        VideojuegoSteamDTO steamDto = mock(VideojuegoSteamDTO.class);

        when(steamClient.getGame(1))
                .thenReturn(steamDto);

        when(ofertaRepository.findBySteamAppID(1))
                .thenReturn(List.of());

        VideojuegoFront result = servicioVideojuego.buscarPorId(1);

        assertNotNull(result);

        verify(serviceAsyncVideojuego).guardarJuegoAsync(1);
    }

    @Test
    void buscarPorIdWishList_shouldReturnFromDatabase() {

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.of(juego));

        Videojuego result =
                servicioVideojuego.buscarPorIdWishList(1L);

        assertNotNull(result);

        verify(serviceAsyncVideojuego, never())
                .createJuego(anyLong());
    }

    @Test
    void buscarPorIdWishList_shouldCreateWhenNotExists() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        when(serviceAsyncVideojuego.createJuego(1L))
                .thenReturn(juego);

        Videojuego result =
                servicioVideojuego.buscarPorIdWishList(1L);

        assertNotNull(result);

        verify(serviceAsyncVideojuego)
                .createJuego(1L);
    }
}