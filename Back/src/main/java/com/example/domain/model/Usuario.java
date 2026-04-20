package com.example.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    private UUID idUsuario; // Este será el UUID de Supabase

    private String email;

    // Constructor vacío para JPA
    public Usuario() {}

    public Usuario(UUID idUsuario, String email) {
        this.idUsuario = idUsuario;
        this.email = email;
    }

    // Getters y Setters
    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}