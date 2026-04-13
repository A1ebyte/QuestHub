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

    public Set<Videojuego> getVideojuegos() {
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
    
    public void addVideojuego(Videojuego videojuego) {
        if (videojuegos.add(videojuego)) {
            videojuego.getGeneros().add(this);
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Genero)) return false;
        Genero that = (Genero) o;
        return idGenre == that.idGenre;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(idGenre);
    }

}
