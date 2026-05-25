package com.example.service.bundle;

import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.repository.BundleRepository;
import com.example.domain.repository.OfertaRepository;
import com.example.external.steam.DTOs.BundleInfoDTO;
import com.example.external.steam.DTOs.BundleSteamDTO;
import com.example.external.steam.DTOs.MovieDTO;
import com.example.external.steam.DTOs.ScreenshotDTO;
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
class ServiceAsyncBundleTest {

    @Mock
    BundleRepository bundleRepository;

    @Mock
    SteamClient steamClient;

    @Mock
    OfertaRepository ofertaRepository;

    @InjectMocks
    ServiceAsyncBundle serviceAsyncBundle;

    @Test
    void guardarBundleAsync_shouldReturnWhenBundleAlreadyExists() {

        Bundle bundle = new Bundle();

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.of(bundle));

        serviceAsyncBundle.guardarBundleAsync(1L);

        verify(steamClient, never()).getBundle(anyLong());
    }

    @Test
    void createBundle_shouldReturnExistingBundle() {

        Bundle bundle = new Bundle();

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.of(bundle));

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertEquals(bundle, result);

        verify(steamClient, never()).getBundle(anyLong());
    }

    @Test
    void createBundle_shouldReturnNullWhenSteamReturnsNull() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        when(steamClient.getBundle(1L))
                .thenReturn(null);

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertNull(result);
    }

    @Test
    void createBundle_shouldSaveBundleWithoutApps() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.id()).thenReturn(1L);
        when(dto.apps()).thenReturn(null);

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        Bundle saved = new Bundle();

        when(bundleRepository.save(any(Bundle.class)))
                .thenReturn(saved);

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertNotNull(result);

        verify(bundleRepository, atLeastOnce())
                .save(any(Bundle.class));
    }

    @Test
    void createBundle_shouldLoadBundleProducts() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.id()).thenReturn(1L);

        BundleInfoDTO info = mock(BundleInfoDTO.class);

        when(info.id()).thenReturn(10L);

        when(dto.apps()).thenReturn(List.of(info));

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        VideojuegoSteamDTO gameDto = mock(VideojuegoSteamDTO.class);

        when(gameDto.short_description()).thenReturn("desc");
        when(gameDto.about_the_game()).thenReturn("about");
        when(gameDto.capsule_image()).thenReturn("img");
        when(gameDto.movies()).thenReturn(null);
        when(gameDto.screenshots()).thenReturn(null);

        when(steamClient.getGame(10L))
                .thenReturn(gameDto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        Bundle saved = new Bundle();

        when(bundleRepository.save(any(Bundle.class)))
                .thenReturn(saved);

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertNotNull(result);

        verify(steamClient).getGame(10L);
    }

    @Test
    void createBundle_shouldLoadMoviesAndScreenshots() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.id()).thenReturn(1L);

        BundleInfoDTO info = mock(BundleInfoDTO.class);

        when(info.id()).thenReturn(10L);

        when(dto.apps()).thenReturn(List.of(info));

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        MovieDTO movie = mock(MovieDTO.class);

        when(movie.thumbnail()).thenReturn("thumb");
        when(movie.hls_h264()).thenReturn("video");

        ScreenshotDTO screenshot = mock(ScreenshotDTO.class);

        when(screenshot.path_full()).thenReturn("full");
        when(screenshot.path_thumbnail()).thenReturn("mini");

        VideojuegoSteamDTO gameDto = mock(VideojuegoSteamDTO.class);

        when(gameDto.short_description()).thenReturn("desc");
        when(gameDto.about_the_game()).thenReturn("about");
        when(gameDto.capsule_image()).thenReturn("img");
        when(gameDto.movies()).thenReturn(List.of(movie));
        when(gameDto.screenshots()).thenReturn(List.of(screenshot));

        when(steamClient.getGame(10L))
                .thenReturn(gameDto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        Bundle saved = new Bundle();

        when(bundleRepository.save(any(Bundle.class)))
                .thenReturn(saved);

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertNotNull(result);

        verify(steamClient).getGame(10L);
    }

    @Test
    void createBundle_shouldAddOffers() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.id()).thenReturn(1L);
        when(dto.apps()).thenReturn(null);

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        Oferta oferta = new Oferta();

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of(oferta));

        Bundle saved = new Bundle();

        when(bundleRepository.save(any(Bundle.class)))
                .thenReturn(saved);

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertNotNull(result);

        verify(ofertaRepository).findBySteamAppID(1L);
    }

    @Test
    void createBundle_shouldHandleDataIntegrityViolation() {

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.id()).thenReturn(1L);
        when(dto.apps()).thenReturn(null);

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of());

        when(bundleRepository.save(any(Bundle.class)))
                .thenThrow(DataIntegrityViolationException.class);

        Bundle existing = new Bundle();

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(existing));

        Bundle result = serviceAsyncBundle.createBundle(1L);

        assertEquals(existing, result);
    }
}