package com.example.api.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.exceptions.BadRequestException;
import com.example.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1.0/wishlist")
public class WishlistController {
	private final WishlistService wishlistService;

	public WishlistController(WishlistService wishlistService) {
		this.wishlistService = wishlistService;
	}

	@PostMapping("/toggle")
	public ResponseEntity<?> toggleWishlist(@RequestHeader("Authorization") String authToken,
			@RequestBody Map<String, Object> body) {

		UUID userId = extraerUserIdDelToken(authToken);

		Object idObj = body.get("id");

		if (idObj == null) {
			throw new BadRequestException("El ID del item es obligatorio");
		}

		Long itemId = Long.valueOf(idObj.toString());

		return ResponseEntity.ok(wishlistService.toggleWishlist(userId, itemId));
	}

	@DeleteMapping("/eliminar/{itemId}")
	public ResponseEntity<?> eliminarDeWishlist(@RequestHeader("Authorization") String authToken,
			@PathVariable Long itemId) {
		UUID userId = extraerUserIdDelToken(authToken);
		wishlistService.eliminarItem(userId, itemId);

		return ResponseEntity.ok(Map.of("mensaje", "Eliminado correctamente"));
	}

	@GetMapping("/mis-favoritos")
	public ResponseEntity<?> obtenerFavoritosPorUsuario(@RequestHeader("Authorization") String authToken) {
		UUID userId = extraerUserIdDelToken(authToken);
		return ResponseEntity.ok(wishlistService.obtenerFavoritosRapidos(userId));
	}

	private UUID extraerUserIdDelToken(String authToken) {
		if (authToken == null || !authToken.startsWith("Bearer ")) {
			throw new RuntimeException("Token no valido");
		}
		String token = authToken.substring(7);
		DecodedJWT jwt = JWT.decode(token);
		return UUID.fromString(jwt.getSubject());
	}

}
