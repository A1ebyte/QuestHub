package com.example.service;

import com.example.api.controller.DTOs.WishlistDTO;
import com.example.api.controller.mappers.FrontMapper;
import com.example.domain.model.Bundle;
import com.example.domain.model.Usuario;
import com.example.domain.model.Videojuego;
import com.example.domain.model.Wishlist;
import com.example.domain.repository.UsuarioRepository;
import com.example.domain.repository.WishlistRepository;
import com.example.exceptions.BadRequestException;

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
	private final ServiceOferta serviceOferta;

	public WishlistService(WishlistRepository wishlistRepository, UsuarioRepository usuarioRepository,
			ServicioVideojuego servicioVideojuego, ServiceBundle serviceBundle, ServiceOferta serviceOferta) {
		this.wishlistRepository = wishlistRepository;
		this.usuarioRepository = usuarioRepository;
		this.servicioVideojuego = servicioVideojuego;
		this.serviceBundle = serviceBundle;
		this.serviceOferta = serviceOferta;
	}

	private Wishlist obtenerOCrearWishlist(UUID userId) {

		return wishlistRepository.findByUsuario_IdUsuario(userId).orElseGet(() -> {

			Usuario usuario = usuarioRepository.findById(userId)
					.orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

			Wishlist nueva = new Wishlist();

			nueva.setUsuario(usuario);

			return wishlistRepository.save(nueva);
		});
	}

	@Transactional
	public String toggleWishlist(UUID userId, Long itemId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);

		Optional<Videojuego> juegoExistente = wishlist.getVideojuegos().stream()
				.filter(v -> v.getIdVideojuego() == (itemId)).findFirst();

		if (juegoExistente.isPresent()) {

			wishlist.getVideojuegos().remove(juegoExistente.get());

			wishlistRepository.save(wishlist);

			return "Juego eliminado";
		}

		Optional<Bundle> bundleExistente = wishlist.getBundles().stream().filter(b -> b.getIdBundle() == (itemId))
				.findFirst();

		if (bundleExistente.isPresent()) {

			wishlist.getBundles().remove(bundleExistente.get());

			wishlistRepository.save(wishlist);

			return "Bundle eliminado";
		}

		Videojuego juego = servicioVideojuego.buscarPorIdWishList(itemId);

		if (juego != null) {

			wishlist.addVideojuego(juego);

			wishlistRepository.save(wishlist);

			return "Juego añadido";
		}

		Bundle bundle = serviceBundle.buscarEntidadPorId(itemId);

		if (bundle != null) {

			wishlist.addBundle(bundle);

			wishlistRepository.save(wishlist);

			return "Bundle añadido";
		}

		throw new BadRequestException("No existe ningún item con ID " + itemId);
	}

	@Transactional
	public void eliminarItem(UUID userId, long itemId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().removeIf(v -> v.getIdVideojuego() == (itemId));

		wishlist.getBundles().removeIf(b -> b.getIdBundle() == (itemId));

		wishlistRepository.save(wishlist);
	}

	@Transactional
	public void vaciarWishlistCompleta(UUID userId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);

		wishlist.getVideojuegos().clear();

		wishlist.getBundles().clear();

		wishlistRepository.save(wishlist);
	}

	public List<WishlistDTO> obtenerFavoritosRapidos(UUID userId) {

		Wishlist wishlist = obtenerOCrearWishlist(userId);

		List<WishlistDTO> resultado = new ArrayList<>();

		for (Videojuego v : wishlist.getVideojuegos()) {

			var infoDato = FrontMapper.toDTO(v, serviceOferta);

			resultado.add(new WishlistDTO(wishlist.getId(), "JUEGO", v.getIdVideojuego(), infoDato.nombre(),
					infoDato.imagen()));
		}

		for (Bundle b : wishlist.getBundles()) {

			resultado
					.add(new WishlistDTO(wishlist.getId(), "BUNDLE", b.getIdBundle(), b.getNombre(), b.getImagenUrl()));
		}

		return resultado;
	}
}