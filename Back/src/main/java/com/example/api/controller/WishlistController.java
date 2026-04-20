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
                                            @RequestBody Map<String,Object> body) {
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

            Object idObj = body.get("idVideojuego");
            System.out.println(idObj.toString());
            if(idObj==null){
                return ResponseEntity.badRequest().body("El Id es oblogatorio");
            }

            Long gameId = Long.valueOf(body.get("idVideojuego").toString());
            System.out.println(gameId);

            String mensaje = wishlistService.toggleWishlist(userId, gameId);

            return ResponseEntity.ok(Map.of("mensaje", mensaje));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error en el servidor: " + e.getMessage());        }
    }

    @GetMapping("mis-favoritos")
    public ResponseEntity<?> obtenerFavoritosPorUsuario(@RequestHeader("Authorization") String AuthToken) {
        try{
            if(AuthToken == null || !AuthToken.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("No autorizado");
            }
            String token = AuthToken.substring(7);
            DecodedJWT jwt = JWT.decode(token);
            UUID userId = UUID.fromString(jwt.getSubject());

            return ResponseEntity.ok(wishlistService.obtenerFavoritosPorUsuario(userId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener la listas:"+ e.getMessage());
        }
    }
}
