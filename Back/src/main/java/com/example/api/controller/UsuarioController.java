package com.example.api.controller;

import com.example.domain.model.Usuario;
import com.example.domain.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<?> sicronizar(@RequestBody Map<String,String> datos) {
        UUID uuid = UUID.fromString(datos.get("id"));
        String email = datos.get("email");

        Usuario usuario = usuarioRepository.findById(uuid)
                .orElse(new Usuario(uuid, email));

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario sincronizado correctamente");
    }
}
