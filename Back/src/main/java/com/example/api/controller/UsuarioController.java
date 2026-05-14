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
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;
    private final ServiceUsuario serviceUsuario;

    public UsuarioController(UsuarioRepository usuarioRepository, ServiceUsuario serviceUsuario) {
        this.usuarioRepository = usuarioRepository;
        this.serviceUsuario = serviceUsuario;
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<?> sicronizar(@RequestBody Map<String,String> datos) {
        try {
            // Verificamos que los datos no lleguen nulos
            if (datos.get("id") == null || datos.get("email") == null) {
                return ResponseEntity.badRequest().body("Faltan datos (id o email)");
            }

            UUID uuid = UUID.fromString(datos.get("id"));
            String email = datos.get("email");

            Usuario usuario = usuarioRepository.findById(uuid)
                    .orElse(new Usuario(uuid, email));

            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Usuario sincronizado correctamente");
        } catch (Exception e) {
            // Así verás en la consola de Java exactamente qué falló
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error en sincronización: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarCuenta(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");

            UUID userId = serviceUsuario.extraerIdDelToken(jwt);
            serviceUsuario.eliminarCuentaCompleta(userId);

            return ResponseEntity.ok("Cuenta y datos asociados eliminados con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar la cuenta: " + e.getMessage());
        }
    }
    
    //importante para que el estado de las notificaciones esté actualizado y no sea siempre false
    @GetMapping("/preferencias/estado")
    public ResponseEntity<Boolean> obtenerEstadoNotificaciones(@RequestParam("id") UUID id) {
    	try {
            return usuarioRepository.findById(id)
                    .map(u -> ResponseEntity.ok(u.isRecibirNotificaciones()))
                    .orElse(ResponseEntity.ok(false)); // Si no existe en BD, devolvemos false por defecto
        }catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PatchMapping("/preferencias")
    public ResponseEntity<?> actualizarPreferencia(@RequestBody Map<String, Object> datos) {
        try {
            // Extraemos los datos que vienen del fetch de React
            UUID uuid = UUID.fromString((String) datos.get("id"));
            boolean preferencia = (boolean) datos.get("preferencia");

            // Usamos el método que ya creamos en el Repository
            int filasActualizadas = usuarioRepository.updateNotificaciones(uuid, preferencia);

            if (filasActualizadas > 0) {
                return ResponseEntity.ok("Preferencia actualizada con éxito");
            } else {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar: " + e.getMessage());
        }
    }
}
