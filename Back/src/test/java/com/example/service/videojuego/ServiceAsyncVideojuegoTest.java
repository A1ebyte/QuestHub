package com.example.service.videojuego;

import com.example.domain.model.Genero;
import com.example.domain.model.Oferta;
import com.example.domain.model.Videojuego;
import com.example.domain.repository.GeneroRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.domain.repository.VideojuegoRepository;
import com.example.external.steam.DTOs.GenreDTO;
import com.example.external.steam.DTOs.VideojuegoSteamDTO;
import com.example.external.steam.SteamClient;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ServiceAsyncVideojuegoTest {

    @Mock
    VideojuegoRepository videojuegoRepository;

    @Mock
    GeneroRepository generoRepository;

    @Mock
    OfertaRepository ofertaRepository;

    @Mock
    SteamClient steamClient;

    @InjectMocks
    ServiceAsyncVideojuego serviceAsyncVideojuego;

    @Test
    void guardarJuegoAsync_shouldReturnWhenGameAlreadyExists() {

        Videojuego juego = new Videojuego();

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.of(juego));

        serviceAsyncVideojuego.guardarJuegoAsync(1L);

        verify(steamClient, never()).getGame(anyLong());
    }

    @Test
    void createJuego_shouldReturnExistingGame() {

        Videojuego juego = new Videojuego();

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.of(juego));

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertEquals(juego, result);

        verify(steamClient, never()).getGame(anyLong());
    }

    @Test
    void createJuego_shouldReturnNullWhenSteamReturnsNull() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        when(steamClient.getGame(1L))
                .thenReturn(null);

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertNull(result);
    }

    @Test
    void createJuego_shouldSaveGameWithoutOffers() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        VideojuegoSteamDTO dto = mock(VideojuegoSteamDTO.class);

        when(dto.steam_appid()).thenReturn(1L);
        when(dto.genres()).thenReturn(null);
        when(dto.movies()).thenReturn(null);
        when(dto.screenshots()).thenReturn(null);

        when(steamClient.getGame(1L))
                .thenReturn(dto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        Videojuego saved = new Videojuego();

        when(videojuegoRepository.save(any(Videojuego.class)))
                .thenReturn(saved);

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertNotNull(result);

        verify(videojuegoRepository, atLeastOnce())
                .save(any(Videojuego.class));
    }

    @Test
    void createJuego_shouldSaveGameWithOffers() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        VideojuegoSteamDTO dto = mock(VideojuegoSteamDTO.class);

        when(dto.steam_appid()).thenReturn(1L);
        when(dto.genres()).thenReturn(null);
        when(dto.movies()).thenReturn(null);
        when(dto.screenshots()).thenReturn(null);

        when(steamClient.getGame(1L))
                .thenReturn(dto);

        Oferta oferta = new Oferta();
        oferta.setSteamRating(95);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of(oferta));

        Videojuego saved = new Videojuego();

        when(videojuegoRepository.save(any(Videojuego.class)))
                .thenReturn(saved);

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertNotNull(result);

        verify(videojuegoRepository, atLeastOnce())
                .save(any(Videojuego.class));
    }

    @Test
    void createJuego_shouldCreateGenres() {

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty());

        GenreDTO genreDto = mock(GenreDTO.class);

        when(genreDto.id()).thenReturn(1L);

        VideojuegoSteamDTO dto = mock(VideojuegoSteamDTO.class);

        when(dto.steam_appid()).thenReturn(1L);
        when(dto.genres()).thenReturn(List.of(genreDto));
        when(dto.movies()).thenReturn(null);
        when(dto.screenshots()).thenReturn(null);

        when(steamClient.getGame(1L))
                .thenReturn(dto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        when(generoRepository.findById(1L))
                .thenReturn(Optional.empty());

        Genero genero = new Genero();

        when(generoRepository.save(any(Genero.class)))
                .thenReturn(genero);

        Videojuego saved = new Videojuego();

        when(videojuegoRepository.save(any(Videojuego.class)))
                .thenReturn(saved);

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertNotNull(result);

        verify(generoRepository).save(any(Genero.class));
    }

    @Test
    void createJuego_shouldHandleDataIntegrityViolation() {

        VideojuegoSteamDTO dto = mock(VideojuegoSteamDTO.class);

        when(dto.steam_appid()).thenReturn(1L);
        when(dto.genres()).thenReturn(null);
        when(dto.movies()).thenReturn(null);
        when(dto.screenshots()).thenReturn(null);

        when(steamClient.getGame(1L))
                .thenReturn(dto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        when(videojuegoRepository.save(any(Videojuego.class)))
                .thenThrow(DataIntegrityViolationException.class);

        Videojuego existing = new Videojuego();

        when(videojuegoRepository.findById(1L))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(existing));

        Videojuego result =
                serviceAsyncVideojuego.createJuego(1L);

        assertEquals(existing, result);
    }
}