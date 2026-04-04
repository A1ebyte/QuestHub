package com.example.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Genero {
    @Id
    private Long id_genre;
    private String descripcion;
    @ManyToMany(mappedBy = "generos")
    private Set<Videojuego> videojuegos = new HashSet<>();



    public Genero() {
    }

    public Set<Videojuego> getVideosjuegos() {
        return videojuegos;
    }

    public Long getId_Genre() {
        return id_genre;
    }

    public void setId_Genre(Long id_Genre) {
        this.id_genre = id_Genre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
