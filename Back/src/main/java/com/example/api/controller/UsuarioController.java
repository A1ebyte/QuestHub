package com.example.api.controller;

import com.example.api.controller.DTOs.Recibir.UsuarioNotificaciones;
import com.example.api.controller.DTOs.Recibir.UsuarioSync;
import com.example.domain.model.Usuario;
import com.example.domain.repository.UsuarioRepository;
import com.example.exceptions.BadRequestException;
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
    public ResponseEntity<?> sicronizar(@RequestBody UsuarioSync datos) {
        if (datos.id() == null || datos.email() == null) return ResponseEntity.badRequest().body("Faltan datos (id o email)");

        UUID uuid = datos.id();
        String email = datos.email();
        Usuario usuario = usuarioRepository.findById(uuid).orElse(null);
        
        if (usuario==null) {
        	usuario = new Usuario(uuid, email);
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
    	Usuario user=usuarioRepository.findById(id).orElse(null);
    	if(user==null) {throw new BadRequestException("Error usuario no valido/existente");}
    	
    	return ResponseEntity.ok(user.isRecibirNotificaciones());
    }
    
    @PatchMapping("/preferencias")
    public ResponseEntity<?> actualizarPreferencia(@RequestBody UsuarioNotificaciones datos) {
        boolean actualizado = serviceUsuario.actualizarNotificaciones(datos.id(), datos.preferencia());
        if (actualizado==false) {throw new BadRequestException("Error al actualizar preferencias de comunicacion");}
        
        return ResponseEntity.ok(Map.of("Preferecian_Comunicacion",datos.preferencia()));
    }
}
