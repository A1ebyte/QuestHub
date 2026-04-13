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
    @JoinColumn(name = "Videojuego")
    private Videojuego videojuego;

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

    public Videojuego getVideojuego() {
        return videojuego;
    }

    public void setVideojuego(Videojuego videojuegos) {
        this.videojuego = videojuegos;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Movie)) return false;
        Movie that = (Movie) o;
        return idMovie == that.idMovie;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(idMovie);
    }

}
