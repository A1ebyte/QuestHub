package com.example.domain.model;

import jakarta.persistence.*;

@Entity
public class Captura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idCaptura;
    @Column(columnDefinition = "TEXT")
    private String miniatura;//Path_thumbnail
    @Column(columnDefinition = "TEXT", unique = true)
    private String imagen;//path_full;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Videojuego")
    private Videojuego videojuego;

    public Captura() {
    }

    public long getIdCaptura() {
        return idCaptura;
    }


    public String getMiniatura() {
        return miniatura;
    }

    public void setMiniatura(String miniatura) {
        this.miniatura = miniatura;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Videojuego getVideojuego() {
        return videojuego;
    }

    public void setVideojuego(Videojuego videojuegos) {
        this.videojuego = videojuegos;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Captura)) return false;
        Captura that = (Captura) o;
        return imagen != null && imagen.equals(that.imagen);
    }

    @Override
    public int hashCode() {
        return imagen != null ? imagen.hashCode() : 0;
    }
}
