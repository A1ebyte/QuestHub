package com.example.api.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.service.ServiceBundle;
import com.example.service.ServicioVideojuego;
import com.example.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;
    private final ServicioVideojuego servicioVideojuego;
    private final ServiceBundle serviceBundle;

    public WishlistController(WishlistService wishlistService,
                              ServicioVideojuego servicioVideojuego,
                              ServiceBundle serviceBundle) {
        this.wishlistService = wishlistService;
        this.servicioVideojuego = servicioVideojuego;
        this.serviceBundle = serviceBundle;
    }



    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(@RequestHeader("Authorization") String AuthToken,
                                            @RequestBody Map<String,Object> body) {
        try {
            UUID userId = extraerUserIdDelToken(AuthToken);

            Object idObj = body.getOrDefault("idItem", body.get("idVideojuego"));

            if (idObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "El ID del item es obligatorio"));
            }

            Long itemId = Long.valueOf(idObj.toString());
            String mensaje = wishlistService.toggleWishlist(userId, itemId);

            return ResponseEntity.ok(Map.of("mensaje", mensaje));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al procesar toggle: " + e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar/{idVideojuego}")
    public ResponseEntity<?> eliminarDeWishlist(@RequestHeader("Authorization") String AuthToken,
                                                @PathVariable Long idVideojuego) {
        try {
            UUID userId = extraerUserIdDelToken(AuthToken);
            wishlistService.eliminarItem(userId, idVideojuego);

            return ResponseEntity.ok(Map.of("mensaje", "Eliminado correctamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/mis-favoritos")
    public ResponseEntity<?> obtenerFavoritosPorUsuario(@RequestHeader("Authorization") String AuthToken) {
        try{
            UUID userId = extraerUserIdDelToken(AuthToken);

            return ResponseEntity.ok(wishlistService.obtenerFavoritosRapidos(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al recuperar favoritos"));
        }
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
