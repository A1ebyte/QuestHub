package com.example.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Genero {
    @Id
    private long idGenre;
    private String descripcion;
    @ManyToMany(mappedBy = "generos")
    private Set<Videojuego> videojuegos = new HashSet<>();



    public Genero() {
    }

    public Set<Videojuego> getVideosjuegos() {
        return videojuegos;
    }

    public long getIdGenre() {
        return idGenre;
    }

    public void setIdGenre(long id_Genre) {
        this.idGenre = id_Genre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
