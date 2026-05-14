package com.example.api.controller;

import com.example.domain.model.Usuario;
import com.example.domain.repository.UsuarioRepository;
import com.example.service.ServiceUsuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;
    private final ServiceUsuario serviceUsuario;

    public UsuarioController(UsuarioRepository usuarioRepository, ServiceUsuario serviceUsuario) {
        this.usuarioRepository = usuarioRepository;
        this.serviceUsuario = serviceUsuario;
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<?> sicronizar(@RequestBody Map<String,String> datos) {
        if (datos.get("id") == null || datos.get("email") == null) return ResponseEntity.badRequest().body("Faltan datos (id o email)");

        UUID uuid = UUID.fromString(datos.get("id"));
        String email = datos.get("email");
        Usuario usuario = usuarioRepository.findById(uuid).orElse(null);
        
        if (usuario==null) {
        	new Usuario(uuid, email);
        	usuarioRepository.save(usuario);
        }
        
        return ResponseEntity.ok("Usuario sincronizado correctamente");
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarCuenta(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");

        UUID userId = serviceUsuario.extraerIdDelToken(jwt);
        serviceUsuario.eliminarCuentaCompleta(userId);

        return ResponseEntity.ok("Cuenta y datos asociados eliminados con éxito");
    }
    
    @GetMapping("/preferencias")
    public ResponseEntity<Boolean> obtenerEstadoNotificaciones(@RequestParam("id") UUID id) {
        return usuarioRepository.findById(id)
                .map(u -> ResponseEntity.ok(u.isRecibirNotificaciones()))
                .orElse(ResponseEntity.ok(false));
    }
    
    @PatchMapping("/preferencias")
    public ResponseEntity<?> actualizarPreferencia(@RequestBody Map<String, Object> datos) {
        UUID uuid = UUID.fromString((String) datos.get("id"));
        boolean preferencia = (boolean) datos.get("preferencia");

        // Usamos el método que ya creamos en el Repository
        int filasActualizadas = usuarioRepository.updateNotificaciones(uuid, preferencia);

        if (filasActualizadas > 0) {
            return ResponseEntity.ok("Preferencia actualizada con éxito");
        } else {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
    }
}
