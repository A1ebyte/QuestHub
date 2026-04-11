package com.example.domain.model;

import jakarta.persistence.*;

@Entity
public class Captura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idCaptura;
    @Column(columnDefinition = "TEXT")
    private String miniatura;//Path_thumbnail
    @Column(columnDefinition = "TEXT")
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
}
