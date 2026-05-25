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

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

		return wishlistRepository.findByUsuario_IdUsuario(userId).orElseGet(() -> {

			Usuario usuario = usuarioRepository.findById(userId).orElseGet(() -> {
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
	@CacheEvict(value = "wishlist_ids", key = "#root.args[0]")
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
	@CacheEvict(value = "wishlist_ids", key = "#root.args[0]")
	public void eliminarItem(UUID userId, long itemId) {
		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().removeIf(v -> v.getIdVideojuego() == (itemId));
		wishlist.getBundles().removeIf(b -> b.getIdBundle() == (itemId));

		wishlistRepository.save(wishlist);
	}

	@Transactional
	@CacheEvict(value = "wishlist_ids", key = "#root.args[0]")
	public void vaciarWishlistCompleta(UUID userId) {
		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().clear();
		wishlist.getBundles().clear();

		wishlistRepository.save(wishlist);
	}

	public Page<WishlistDTO> obtenerFavoritos(UUID userId, String titulo, Pageable pageable) {

		Wishlist wishlist = wishlistRepository.findByUsuario_IdUsuario(userId).orElse(null);
		if (wishlist == null) {
			return Page.empty(pageable);
		}

		String filtro = (titulo == null || titulo.isBlank()) ? null : titulo.toLowerCase();
		List<WishlistDTO> todos = new ArrayList<>();
		for (Videojuego v : wishlist.getVideojuegos()) {
			if (filtro == null || v.getNombre().toLowerCase().contains(filtro)) {
				todos.add(new WishlistDTO(wishlist.getId(), v.getIdVideojuego(), v.getNombre(), v.getImagenUrl(),
						v.isOnSale()));
			}
		}

		for (Bundle b : wishlist.getBundles()) {
			if (filtro == null || b.getNombre().toLowerCase().contains(filtro)) {
				todos.add(new WishlistDTO(wishlist.getId(), b.getIdBundle(), b.getNombre(), b.getImagenUrl(),
						b.isOnSale()));
			}
		}
		
		todos.sort((a, b) -> Boolean.compare(b.onSale(), a.onSale()));

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), todos.size());

		List<WishlistDTO> content = (start > todos.size()) ? List.of() : todos.subList(start, end);

		return new PageImpl<>(content, pageable, todos.size());
	}

	@Cacheable(value = "wishlist_ids", key = "#root.args[0]", unless = "#result == null || #result.isEmpty()")
	public List<Long> obtenerIdsWishlist(UUID userId) {

		Wishlist wishlist = wishlistRepository.findByUsuario_IdUsuario(userId).orElse(null);
		if (wishlist == null)
			return null;

		List<Long> ids = new ArrayList<>();

		for (Videojuego v : wishlist.getVideojuegos()) {
			ids.add(v.getIdVideojuego());
		}

		for (Bundle b : wishlist.getBundles()) {
			ids.add(b.getIdBundle());
		}
		
		return ids;
	}
}