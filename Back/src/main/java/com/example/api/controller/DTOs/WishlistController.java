package com.example.api.controller.DTOs;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.service.sync.WishlistService;
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
                                            @RequestBody Map<String,Long> body) {
        try {
            if (AuthToken == null || !AuthToken.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Falta AuthToken autorizado");
            }
            System.out.println(AuthToken);
            String token = AuthToken.substring(7);
            System.out.println(token);
            DecodedJWT jwt = JWT.decode(token);
            System.out.println(jwt.getSubject());
            UUID userId = UUID.fromString(jwt.getSubject());

            Long gameId = body.get("idVideojuego");

            if (gameId == null) {
                return ResponseEntity.badRequest().body("El Id es obligatorio");
            }

            String mensaje = wishlistService.toggleWishlist(userId, gameId);

            return ResponseEntity.ok(Map.of("mensaje", mensaje));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido: " + e.getMessage());
        }
    }
}
