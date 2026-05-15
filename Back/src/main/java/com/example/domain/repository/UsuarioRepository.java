package com.example.domain.repository;

import com.example.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByEmail(String email);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE usuario SET recibir_notificaciones = :preferencia WHERE id_usuario = :id", nativeQuery = true)
    int updateNotificaciones(@Param("id") UUID id, @Param("preferencia") boolean preferencia);
}