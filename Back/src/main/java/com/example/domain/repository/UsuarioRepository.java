package com.example.domain.repository;

import com.example.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // Útil para buscar por email si fuera necesario
    Optional<Usuario> findByEmail(String email);
}