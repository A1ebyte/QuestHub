package com.example.api.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/wishlist")
public class WishlistController {
	private final WishlistService wishlistService;


	public WishlistController(WishlistService wishlistService) {
		this.wishlistService = wishlistService;
	}

	@PostMapping("/toggle")
	public ResponseEntity<?> toggleWishlist(@RequestHeader("Authorization") String AuthToken,
			@RequestBody Map<String, Object> body) {
		UUID userId = extraerUserIdDelToken(AuthToken);
		Object idObj = body.getOrDefault("idItem", null);

		if (idObj == null)
			return ResponseEntity.badRequest().body(Map.of("error", "El ID del item es obligatorio"));
		
		Long itemId = Long.valueOf(idObj.toString());
		String mensaje = wishlistService.toggleWishlist(userId, itemId);

		return ResponseEntity.ok(Map.of("mensaje", mensaje));
	}

	@DeleteMapping("/eliminar/{idVideojuego}")
	public ResponseEntity<?> eliminarDeWishlist(@RequestHeader("Authorization") String AuthToken,
			@PathVariable Long idVideojuego) {
		UUID userId = extraerUserIdDelToken(AuthToken);
		wishlistService.eliminarItem(userId, idVideojuego);

		return ResponseEntity.ok(Map.of("mensaje", "Eliminado correctamente"));
	}

	@GetMapping("/mis-favoritos")
	public ResponseEntity<?> obtenerFavoritosPorUsuario(@RequestHeader("Authorization") String AuthToken) {
		UUID userId = extraerUserIdDelToken(AuthToken);

		return ResponseEntity.ok(wishlistService.obtenerFavoritosRapidos(userId));
	}

	private UUID extraerUserIdDelToken(String AuthToken) {
		if (AuthToken == null || !AuthToken.startsWith("Bearer ")) {
			throw new RuntimeException("Token no valido");
		}
		String token = AuthToken.substring(7);
		DecodedJWT jwt = JWT.decode(token);
		return UUID.fromString(jwt.getSubject());
	}

}
