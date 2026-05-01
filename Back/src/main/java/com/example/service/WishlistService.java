package com.example.service;

import com.example.api.controller.DTOs.WishlistDTO;
import com.example.api.controller.mappers.FrontMapper;
import com.example.api.controller.mappers.WishlistMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ServicioVideojuego servicioVideojuego;
    private final ServiceBundle serviceBundle;
    private final ServiceOferta serviceOferta;
    private final WishlistMapper wishlistMapper;

    public WishlistService(WishlistRepository wishlistRepository, ServicioVideojuego servicioVideojuego, ServiceBundle serviceBundle, ServiceOferta serviceOferta, WishlistMapper wishlistMapper) {
        this.wishlistRepository = wishlistRepository;
        this.servicioVideojuego = servicioVideojuego;
        this.serviceBundle = serviceBundle;
        this.serviceOferta = serviceOferta;
        this.wishlistMapper = wishlistMapper;
    }

    @Transactional
    public String toggleWishlist(UUID userId, Long itemId) {
        // 1. Intentamos buscar si ya existe (para borrarlo)
        Optional<Wishlist> existenteJuego = wishlistRepository.findByUserIdAndVideojuegos_IdVideojuego(userId, itemId);

        if (existenteJuego.isPresent()) {
            // Usamos nuestro nuevo método del repo
            wishlistRepository.eliminarVideojuegoDeWishlist(userId, itemId);
            return "Videojuego eliminado de la Wishlist";
        }

        Optional<Wishlist> existenteBundle = wishlistRepository.findByUserIdAndBundles_IdBundle(userId, itemId);
        if (existenteBundle.isPresent()) {
            wishlistRepository.eliminarBundleDeWishlist(userId, itemId);
            return "Bundle eliminado de la Wishlist";
        }

        // 2. Si no existe, lo añadimos (Lógica de guardado)
        Videojuego juego = servicioVideojuego.buscarPorIdWishList(itemId);
        if (juego != null) {
            Wishlist nuevo = new Wishlist();
            nuevo.setUserId(userId);
            // Tip de Mentor: Asegúrate de que addVideojuego inicialice el Set si es null
            nuevo.addVideojuego(juego);
            wishlistRepository.save(nuevo);
            return "Videojuego añadido a la wishlist";
        }

        // ... misma lógica para Bundle ...
        Bundle bundle = serviceBundle.buscarEntidadPorId(itemId);
        if (bundle != null) {
            Wishlist nueva = new Wishlist();
            nueva.setUserId(userId);
            nueva.addBundle(bundle);
            wishlistRepository.save(nueva);
            return "Añadido a la wishlist";
        }

        return "Error: No se encontró ningún juego o bundle con ID " + itemId;
    }

    @Transactional
    public void eliminarItem(UUID userId, Long gameId) {

        wishlistRepository.eliminarVideojuegoDeWishlist(userId, gameId);
        wishlistRepository.eliminarBundleDeWishlist(userId, gameId);

    }

    public List<Map<String, Object>> obtenerFavoritoDetallados(UUID userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);

        return items.stream().map(item -> {
            Map<String, Object> dto = new HashMap<>();

            // ✅ CORRECCIÓN: Usamos .put(key, value)
            dto.put("idWishlist", item.getId());
            dto.put("fechaAgregado", item.getFechaAgregado());

            if (!item.getVideojuegos().isEmpty()) {
                Videojuego v = item.getVideojuegos().iterator().next();
                var infoDato = FrontMapper.toDTO(v, serviceOferta);
                dto.put("tipo", "JUEGO");
                dto.put("idItem", v.getIdVideojuego());
                dto.put("nombre", infoDato.descripcion());
                dto.put("imagen", infoDato.imagen());
                dto.put("precio", infoDato.ofertas());
            } else if (!item.getBundles().isEmpty()) {
                Bundle b = item.getBundles().iterator().next();
                var infoDato = FrontMapper.toDTO(b, serviceOferta);

                dto.put("tipo", "BUNDLE");
                dto.put("idItem", b.getIdBundle());
                dto.put("nombre", infoDato.nombre()); // 👈 Lo mismo para el Bundle
                dto.put("imagen", infoDato.imagen());
                dto.put("precio", infoDato.ofertas());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<WishlistDTO> obtenerFavoritosRapidos(UUID userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);
        return items.stream().map(item -> {
                    if (!item.getVideojuegos().isEmpty()) {
                        Videojuego v = item.getVideojuegos().iterator().next();
                        var infoDato = FrontMapper.toDTO(v, serviceOferta);
                        return new WishlistDTO(
                                item.getId(),
                                "JUEGO",
                                v.getIdVideojuego(),
                                infoDato.nombre(),
                                infoDato.imagen()
                        );
                    }
                    if (item.getBundles() != null && !item.getBundles().isEmpty()) {
                        Bundle b = item.getBundles().iterator().next();
                        return new WishlistDTO(
                                item.getId(),
                                "BUNDLE",
                                b.getIdBundle(),
                                b.getNombre(),
                                b.getImagenUrl()
                        );
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();
    }
}
