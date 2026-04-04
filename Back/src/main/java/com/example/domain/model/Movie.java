package com.example.domain.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Movie {
    @Id
    private long id_movie;
    @Column(columnDefinition = "TEXT")
    private String titulo; //name
    @Column(columnDefinition = "TEXT")
    private String miniatura; //thumbnail
    @Column(columnDefinition = "TEXT")
    private String video; //dash_h264


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_videojuego")
    private Videojuego videojuegos;

    public Movie() {
    }

    public long getId_movie() {
        return id_movie;
    }

    public void setId_movie(long id_movie) {
        this.id_movie = id_movie;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMiniatura() {
        return miniatura;
    }

    public void setMiniatura(String miniatura) {
        this.miniatura = miniatura;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public Videojuego getVideojuegos() {
        return videojuegos;
    }

    public void setVideojuegos(Videojuego videojuegos) {
        this.videojuegos = videojuegos;
    }
}
