package com.example.service;

import com.example.api.controller.DTOs.ToggleWishlistResponse;
import com.example.api.controller.DTOs.WishlistDTO;
import com.example.api.controller.DTOs.videojuego.VideojuegoFront;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Usuario;
import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.UsuarioRepository;
import com.example.domain.repository.WishlistRepository;
import com.example.exceptions.BadRequestException;
import com.example.service.bundle.ServiceBundle;
import com.example.service.videojuego.ServicioVideojuego;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WishlistService {

	private final WishlistRepository wishlistRepository;
	private final UsuarioRepository usuarioRepository;
	private final ServicioVideojuego servicioVideojuego;
	private final ServiceBundle serviceBundle;

	public WishlistService(WishlistRepository wishlistRepository, UsuarioRepository usuarioRepository,
			ServicioVideojuego servicioVideojuego, ServiceBundle serviceBundle) {
		this.wishlistRepository = wishlistRepository;
		this.usuarioRepository = usuarioRepository;
		this.servicioVideojuego = servicioVideojuego;
		this.serviceBundle = serviceBundle;
	}

	private Wishlist obtenerOCrearWishlist(UUID userId) {

	    return wishlistRepository.findByUsuario_IdUsuario(userId)
	        .orElseGet(() -> {

	            Usuario usuario = usuarioRepository.findById(userId)
	                .orElseGet(() -> {
	                    Usuario nuevo = new Usuario();
	                    nuevo.setIdUsuario(userId);

	                    return usuarioRepository.save(nuevo);
	                });

	            Wishlist nueva = new Wishlist();
	            nueva.setUsuario(usuario);

	            return wishlistRepository.save(nueva);
	        });
	}

	@Transactional
	@CacheEvict(value = "wishlist", key = "#root.args[0]")
	public ToggleWishlistResponse toggleWishlist(UUID userId, Long itemId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);

		Optional<Videojuego> juegoExistente = wishlist.getVideojuegos().stream()
				.filter(v -> v.getIdVideojuego() == itemId).findFirst();

		if (juegoExistente.isPresent()) {

			wishlist.getVideojuegos().remove(juegoExistente.get());
			wishlistRepository.save(wishlist);

			return new ToggleWishlistResponse(true, "REMOVED", itemId);
		}

		Optional<Bundle> bundleExistente = wishlist.getBundles().stream().filter(b -> b.getIdBundle() == itemId)
				.findFirst();

		if (bundleExistente.isPresent()) {

			wishlist.getBundles().remove(bundleExistente.get());
			wishlistRepository.save(wishlist);

			return new ToggleWishlistResponse(true, "REMOVED", itemId);
		}

		Videojuego juego = servicioVideojuego.buscarPorIdWishList(itemId);

		if (juego != null) {

			wishlist.addVideojuego(juego);
			wishlistRepository.save(wishlist);

			return new ToggleWishlistResponse(true, "ADDED", itemId);
		}

		Bundle bundle = serviceBundle.buscarPorIdWishList(itemId);

		if (bundle != null) {

			wishlist.addBundle(bundle);
			wishlistRepository.save(wishlist);

			return new ToggleWishlistResponse(true, "ADDED", itemId);
		}

		throw new BadRequestException("No existe ningún item con ID " + itemId);
	}

	@Transactional
	@CacheEvict(value = "wishlist", key = "#root.args[0]")
	public void eliminarItem(UUID userId, long itemId) {
		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().removeIf(v -> v.getIdVideojuego() == (itemId));
		wishlist.getBundles().removeIf(b -> b.getIdBundle() == (itemId));

		wishlistRepository.save(wishlist);
	}

	@Transactional
	@CacheEvict(value = "wishlist", key = "#root.args[0]")
	public void vaciarWishlistCompleta(UUID userId) {
		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().clear();
		wishlist.getBundles().clear();

		wishlistRepository.save(wishlist);
	}

	@Cacheable(value = "wishlist", key = "#root.args[0]", unless = "#result == null")
	public List<WishlistDTO> obtenerFavoritosRapidos(UUID userId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);
		List<WishlistDTO> resultado = new ArrayList<>();

		for (Videojuego v : wishlist.getVideojuegos()) {
			VideojuegoFront infoDato = FrontMapper.toDTO(v);
			resultado.add(new WishlistDTO(wishlist.getId(), v.getIdVideojuego(), infoDato.nombre(),
					infoDato.imagen(),v.isOnSale()));
		}

		for (Bundle b : wishlist.getBundles()) {
			resultado.add(new WishlistDTO(wishlist.getId(), b.getIdBundle(), b.getNombre(), b.getImagenUrl(), b.isOnSale()));
		}

		return resultado;
	}
}