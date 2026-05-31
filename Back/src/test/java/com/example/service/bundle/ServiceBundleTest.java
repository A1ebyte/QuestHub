package com.example.service.bundle;

import com.example.api.controller.DTOs.bundle.BundleFront;
import com.example.domain.model.Bundle;
import com.example.domain.model.Oferta;
import com.example.domain.model.Tienda;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceBundleTest {

    @Mock
    BundleRepository bundleRepository;

    @Mock
    SteamClient steamClient;

    @Mock
    OfertaRepository ofertaRepository;

    @Mock
    ServiceAsyncBundle serviceAsyncBundle;

    @InjectMocks
    ServiceBundle serviceBundle;

    @Test
    void buscarPorId_shouldReturnBundleFromDatabase() {

        Bundle bundle = new Bundle();
        bundle.setIdBundle(1L);
        bundle.setNombre("Bundle Test");

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.of(bundle));

        BundleFront result = serviceBundle.buscarPorId(1L);

        assertNotNull(result);

        verify(steamClient, never()).getBundle(anyLong());
    }

    @Test
    void buscarPorId_shouldReturnNullWhenSteamReturnsNull() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        when(steamClient.getBundle(1L))
                .thenReturn(null);

        BundleFront result = serviceBundle.buscarPorId(1L);

        assertNull(result);
    }

    @Test
    void buscarPorId_shouldFetchFromSteamAndCallAsyncSave() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO dto = mock(BundleSteamDTO.class);

        when(dto.apps()).thenReturn(null);

        when(steamClient.getBundle(1L))
                .thenReturn(dto);

        Oferta oferta = new Oferta();
        oferta.setSteamRating(90);

        Tienda tienda = new Tienda();
        tienda.setNombre("Steam");

        oferta.setTienda(tienda);

        when(ofertaRepository.findBySteamAppID(1L))
                .thenReturn(List.of(oferta));

        BundleFront result = serviceBundle.buscarPorId(1L);

        assertNotNull(result);

        verify(serviceAsyncBundle).guardarBundleAsync(1L);
    }

    @Test
    void buscarPorId_shouldLoadBundleProducts() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO bundleDto = mock(BundleSteamDTO.class);
        BundleInfoDTO info = mock(BundleInfoDTO.class);
        VideojuegoSteamDTO game = mock(VideojuegoSteamDTO.class);

        when(bundleDto.apps()).thenReturn(List.of(info));
        when(bundleDto.id()).thenReturn(1L);

        when(info.id()).thenReturn(10L);

        when(steamClient.getBundle(1L))
                .thenReturn(bundleDto);

        when(steamClient.getGame(10L))
                .thenReturn(game);

        when(game.short_description()).thenReturn("desc");
        when(game.capsule_image()).thenReturn("img");
        when(game.movies()).thenReturn(null);
        when(game.screenshots()).thenReturn(null);

        BundleFront result = serviceBundle.buscarPorId(1L);

        assertNotNull(result);

        verify(serviceAsyncBundle).guardarBundleAsync(1L);
    }

    @Test
    void buscarPorId_shouldLoadMoviesAndScreenshots() {

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        BundleSteamDTO bundleDto = mock(BundleSteamDTO.class);
        BundleInfoDTO info = mock(BundleInfoDTO.class);
        VideojuegoSteamDTO game = mock(VideojuegoSteamDTO.class);

        MovieDTO movie = mock(MovieDTO.class);
        ScreenshotDTO screenshot = mock(ScreenshotDTO.class);

        when(bundleDto.apps()).thenReturn(List.of(info));
        when(bundleDto.id()).thenReturn(1L);

        when(info.id()).thenReturn(10L);

        when(steamClient.getBundle(1L))
                .thenReturn(bundleDto);

        when(steamClient.getGame(10L))
                .thenReturn(game);

        when(game.short_description()).thenReturn("desc");
        when(game.capsule_image()).thenReturn("img");

        when(game.movies()).thenReturn(List.of(movie));
        when(game.screenshots()).thenReturn(List.of(screenshot));

        when(movie.thumbnail()).thenReturn("thumb");
        when(movie.hls_h264()).thenReturn("video");

        when(screenshot.path_full()).thenReturn("full");
        when(screenshot.path_thumbnail()).thenReturn("mini");

        BundleFront result = serviceBundle.buscarPorId(1L);

        assertNotNull(result);
    }

    @Test
    void buscarPorIdWishList_shouldReturnExistingBundle() {

        Bundle bundle = new Bundle();

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.of(bundle));

        Bundle result = serviceBundle.buscarPorIdWishList(1L);

        assertEquals(bundle, result);

        verify(serviceAsyncBundle, never()).createBundle(anyLong());
    }

    @Test
    void buscarPorIdWishList_shouldCreateBundleWhenNotExists() {

        Bundle bundle = new Bundle();

        when(bundleRepository.findById(1L))
                .thenReturn(Optional.empty());

        when(serviceAsyncBundle.createBundle(1L))
                .thenReturn(bundle);

        Bundle result = serviceBundle.buscarPorIdWishList(1L);

        assertEquals(bundle, result);

        verify(serviceAsyncBundle).createBundle(1L);
    }
}