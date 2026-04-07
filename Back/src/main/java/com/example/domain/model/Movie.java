package com.example.domain.model;

import jakarta.persistence.*;

@Entity
public class Movie {
    @Id
    private long idMovie;
    @Column(columnDefinition = "TEXT")
    private String titulo; //name
    @Column(columnDefinition = "TEXT")
    private String miniatura; //thumbnail
    @Column(columnDefinition = "TEXT")
    private String video; //dash_h264


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idVideojuego")
    private Videojuego videojuegos;

    public Movie() {
    }

    public long getIdMovie() {
        return idMovie;
    }

    public void setIdMovie(long idMovie) {
        this.idMovie = idMovie;
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
