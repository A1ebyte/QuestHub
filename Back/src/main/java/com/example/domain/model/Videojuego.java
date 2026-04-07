package com.example.domain.model;

import jakarta.persistence.*;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "videojuego")
public class Videojuego {
    @Id
    private Long idVideojuegos;
    @Column(columnDefinition = "TEXT")
    private String imagenUrl; //headerImage
    @Column(columnDefinition = "TEXT")
    private String imagenUrlResolucionBaja; //capsule_img
    // private String capturaDePantalla; //screenshots

    private String nombre;
    private int steamRatingPercent; //se llama desde oferta
    private String steamRatingText;
    private LocalDate fechaLanzamiento; //release_date
    @Column(columnDefinition = "TEXT")
    private String descripcion; // detailed_description
    @Column(columnDefinition = "TEXT")
    private String descripcionCorta; //short_description
    @Column(columnDefinition = "TEXT")
    private String acercaDe; //about_the_game
    private String desarolladores; //developer
    private String distribuidora; //punishers


    // --- relaciones GENERO ----
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(name = "genero_videojuego", joinColumns = @JoinColumn(name = "idVideojuego"), inverseJoinColumns = @JoinColumn(name = "idGenre"))

    private Set<Genero> generos = new HashSet<>();


    // --- RELACION MOVIE ---
    @OneToMany(mappedBy = "videojuegos", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Movie> movies = new ArrayList<>();

    // --- RELACION CAPTURA ---
    @OneToMany(mappedBy = "videojuegos", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Captura> capturas = new ArrayList<>();


    public Videojuego() {
    }

    public void addGenero(Genero genero) {
        this.generos.add(genero);
    }

    public Set<Genero> getGeneros() {
        return generos;
    }

    public void addMovie(Movie movie) {
        this.movies.add(movie);
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public List<Captura> getCapturas() {
        return capturas;
    }

    public void addCaptura(Captura captura) {
        this.capturas.add(captura);
    }

    public Long getIdVideojuegos() {
        return idVideojuegos;
    }

    public void setIdVideojuegos(Long idVideojuegos) {
        this.idVideojuegos = idVideojuegos;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getSteamRatingPercent() {
        return steamRatingPercent;
    }

    public void setSteamRatingPercent(int steamRatingPercent) {
        this.steamRatingPercent = steamRatingPercent;
    }

    public LocalDate getFechaLanzamiento() {
        return fechaLanzamiento;
    }

    public void setFechaLanzamiento(LocalDate fechaLanzamiento) {
        this.fechaLanzamiento = fechaLanzamiento;
    }


    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrlResolucionBaja() {
        return imagenUrlResolucionBaja;
    }

    public void setImagenUrlResolucionBaja(String imagenUrlResolucionBaja) {
        this.imagenUrlResolucionBaja = imagenUrlResolucionBaja;
    }


    public String getDescripcionCorta() {
        return descripcionCorta;
    }

    public void setDescripcionCorta(String descripcionCorta) {
        this.descripcionCorta = descripcionCorta;
    }

    public String getAcercaDe() {
        return acercaDe;
    }

    public void setAcercaDe(String acercaDe) {
        this.acercaDe = acercaDe;
    }

    public String getDesarolladores() {
        return desarolladores;
    }

    public void setDesarolladores(String desarolladores) {
        this.desarolladores = desarolladores;
    }

    public String getDistribuidora() {
        return distribuidora;
    }

    public void setDistribuidora(String distribuidora) {
        this.distribuidora = distribuidora;
    }

    public String getSteamRatingText() {
        return steamRatingText;
    }

    public void setSteamRatingText(String steamRatingText) {
        this.steamRatingText = steamRatingText;
    }
}
