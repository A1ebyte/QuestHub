package com.example.service;

import com.example.api.controller.DTOs.ToggleWishlistResponse;
import com.example.api.controller.DTOs.WishlistDTO;
import com.example.domain.model.Bundle;
import com.example.domain.model.Usuario;
import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.UsuarioRepository;
import com.example.domain.repository.WishlistRepository;
import com.example.exceptions.BadRequestException;
import com.example.service.bundle.ServiceBundle;
import com.example.service.videojuego.ServicioVideojuego;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    WishlistRepository wishlistRepository;

    @Mock
    UsuarioRepository usuarioRepository;

    @Mock
    ServicioVideojuego servicioVideojuego;

    @Mock
    ServiceBundle serviceBundle;

    @InjectMocks
    WishlistService wishlistService;

    @Test
    void toggleWishlist_shouldAddVideojuego() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        when(servicioVideojuego.buscarPorIdWishList(1L))
                .thenReturn(juego);

        ToggleWishlistResponse result =
                wishlistService.toggleWishlist(userId, 1L);

        assertEquals("ADDED", result.action());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void toggleWishlist_shouldRemoveVideojuego() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        wishlist.addVideojuego(juego);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        ToggleWishlistResponse result =
                wishlistService.toggleWishlist(userId, 1L);

        assertEquals("REMOVED", result.action());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void toggleWishlist_shouldAddBundle() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        when(servicioVideojuego.buscarPorIdWishList(2L))
                .thenReturn(null);

        Bundle bundle = new Bundle();
        bundle.setIdBundle(2L);

        when(serviceBundle.buscarPorIdWishList(2L))
                .thenReturn(bundle);

        ToggleWishlistResponse result =
                wishlistService.toggleWishlist(userId, 2L);

        assertEquals("ADDED", result.action());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void toggleWishlist_shouldRemoveBundle() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Bundle bundle = new Bundle();
        bundle.setIdBundle(2L);

        wishlist.addBundle(bundle);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        ToggleWishlistResponse result =
                wishlistService.toggleWishlist(userId, 2L);

        assertEquals("REMOVED", result.action());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void toggleWishlist_shouldThrowExceptionWhenItemNotFound() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        when(servicioVideojuego.buscarPorIdWishList(99L))
                .thenReturn(null);

        when(serviceBundle.buscarPorIdWishList(99L))
                .thenReturn(null);

        assertThrows(BadRequestException.class,
                () -> wishlistService.toggleWishlist(userId, 99L));
    }

    @Test
    void eliminarItem_shouldRemoveItems() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        Bundle bundle = new Bundle();
        bundle.setIdBundle(1L);

        wishlist.addVideojuego(juego);
        wishlist.addBundle(bundle);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        wishlistService.eliminarItem(userId, 1L);

        assertTrue(wishlist.getVideojuegos().isEmpty());
        assertTrue(wishlist.getBundles().isEmpty());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void vaciarWishlistCompleta_shouldClearWishlist() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        Bundle bundle = new Bundle();
        bundle.setIdBundle(2L);

        wishlist.addVideojuego(juego);
        wishlist.addBundle(bundle);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        wishlistService.vaciarWishlistCompleta(userId);

        assertTrue(wishlist.getVideojuegos().isEmpty());
        assertTrue(wishlist.getBundles().isEmpty());

        verify(wishlistRepository).save(wishlist);
    }

    @Test
    void obtenerFavoritos_shouldReturnFilteredResults() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);
        juego.setNombre("Elden Ring");
        juego.setImagenUrl("img");
        juego.setOnSale(true);

        Bundle bundle = new Bundle();
        bundle.setIdBundle(2L);
        bundle.setNombre("Fifa Bundle");
        bundle.setImagenUrl("img");
        bundle.setOnSale(false);

        wishlist.addVideojuego(juego);
        wishlist.addBundle(bundle);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        Page<WishlistDTO> result =
                wishlistService.obtenerFavoritos(
                        userId,
                        "elden",
                        PageRequest.of(0, 10)
                );

        assertEquals(1, result.getContent().size());
        assertEquals("Elden Ring",
                result.getContent().get(0).nombre());
    }

    @Test
    void obtenerFavoritos_shouldReturnEmptyWhenWishlistNotFound() {

        UUID userId = UUID.randomUUID();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.empty());

        Page<WishlistDTO> result =
                wishlistService.obtenerFavoritos(
                        userId,
                        null,
                        PageRequest.of(0, 10)
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void obtenerIdsWishlist_shouldReturnIds() {

        UUID userId = UUID.randomUUID();

        Wishlist wishlist = new Wishlist();

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        Bundle bundle = new Bundle();
        bundle.setIdBundle(2L);

        wishlist.addVideojuego(juego);
        wishlist.addBundle(bundle);

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.of(wishlist));

        List<Long> result =
                wishlistService.obtenerIdsWishlist(userId);

        assertEquals(2, result.size());
        assertTrue(result.contains(1L));
        assertTrue(result.contains(2L));
    }

    @Test
    void obtenerIdsWishlist_shouldReturnNullWhenWishlistNotFound() {

        UUID userId = UUID.randomUUID();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.empty());

        List<Long> result =
                wishlistService.obtenerIdsWishlist(userId);

        assertNull(result);
    }

    @Test
    void toggleWishlist_shouldCreateWishlistIfNotExists() {

        UUID userId = UUID.randomUUID();

        when(wishlistRepository.findByUsuario_IdUsuario(userId))
                .thenReturn(Optional.empty());

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(userId);

        when(usuarioRepository.findById(userId))
                .thenReturn(Optional.of(usuario));

        Wishlist nueva = new Wishlist();
        nueva.setUsuario(usuario);

        when(wishlistRepository.save(any(Wishlist.class)))
                .thenReturn(nueva);

        Videojuego juego = new Videojuego();
        juego.setIdVideojuego(1L);

        when(servicioVideojuego.buscarPorIdWishList(1L))
                .thenReturn(juego);

        ToggleWishlistResponse result =
                wishlistService.toggleWishlist(userId, 1L);

        assertEquals("ADDED", result.action());

        verify(wishlistRepository, atLeastOnce()).save(any());
    }
}