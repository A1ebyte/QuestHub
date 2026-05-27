package com.example.api.controller;

import com.example.api.controller.DTOs.recibir.UsuarioNotificaciones;
import com.example.api.controller.DTOs.recibir.UsuarioSync;
import com.example.domain.model.Usuario;
import com.example.domain.repository.UsuarioRepository;
import com.example.exceptions.BadRequestException;
import com.example.service.ServiceUsuario;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1.0/usuarios")
public class UsuarioController {
	private final UsuarioRepository usuarioRepository;
	private final ServiceUsuario serviceUsuario;

	public UsuarioController(UsuarioRepository usuarioRepository, ServiceUsuario serviceUsuario) {
		this.usuarioRepository = usuarioRepository;
		this.serviceUsuario = serviceUsuario;
	}

	@PostMapping("/sincronizar")
	public ResponseEntity<?> sincronizar(@RequestBody UsuarioSync datos) {

	    if (datos.id() == null || datos.email() == null) {
	        throw new BadRequestException("Faltan datos (id o email)");
	    }

	    Usuario usuario = usuarioRepository.findById(datos.id())
	        .orElse(null);

	    if (usuario == null) {

	        try {
	            Usuario nuevo = new Usuario();
	            nuevo.setIdUsuario(datos.id());
	            nuevo.setEmail(datos.email());

	            usuarioRepository.save(nuevo);

	        } catch (DataIntegrityViolationException e) {
	        	  System.out.println("Error sincronizando"+ e);
	        }

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
		Usuario user = usuarioRepository.findById(id).orElse(null);
		if (user == null) {
			throw new BadRequestException("Error usuario no valido/existente");
		}

		return ResponseEntity.ok(user.isRecibirNotificaciones());
	}

	@PatchMapping("/preferencias")
	public ResponseEntity<?> actualizarPreferencia(@RequestBody UsuarioNotificaciones datos) {
		boolean actualizado = serviceUsuario.actualizarNotificaciones(datos.id(), datos.preferencia());
		if (actualizado == false) {
			throw new BadRequestException("Error al actualizar preferencias de comunicacion");
		}

		return ResponseEntity.ok(Map.of("Preferecian_Comunicacion", datos.preferencia()));
	}
}
