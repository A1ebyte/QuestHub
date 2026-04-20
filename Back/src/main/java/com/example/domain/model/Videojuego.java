package com.example.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Videojuego {
    @Id
    private long idVideojuego;
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


    // --- RELACION genero ----
    @ManyToMany(cascade = {CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinTable(name = "genero_videojuego", joinColumns = @JoinColumn(name = "idVideojuego"), inverseJoinColumns = @JoinColumn(name = "idGenre"))
    @JsonIgnore
    private List<Genero> generos = new ArrayList<>();

    // --- RELACION Movie ---
    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Movie> movies = new ArrayList<>();

    // --- RELACION Captura ---
    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Captura> capturas = new ArrayList<>();
    
    // --- RELACION Oferta ---
    @OneToMany(mappedBy = "videojuego", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Oferta> ofertas = new ArrayList<>();


    public Videojuego() {
    }
    
    public void addOferta(Oferta oferta) {
        if (!ofertas.contains(oferta)) {
            ofertas.add(oferta);
            oferta.setVideojuego(this);
        }
    }

    public void addGenero(Genero genero) {
        if (generos.add(genero)) {
            genero.getVideojuegos().add(this);
        }
    }

    public List<Genero> getGeneros() {
        return generos;
    }

    public void addMovie(Movie movie) {
        if (!movies.contains(movie)) {
            movies.add(movie);
            movie.setVideojuego(this);
        }
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public List<Captura> getCapturas() {
        return capturas;
    }

    public void addCaptura(Captura captura) {
        if (!capturas.contains(captura)) {
            capturas.add(captura);
            captura.setVideojuego(this);
        }
    }

    public long getIdVideojuego() {
        return idVideojuego;
    }

    public void setIdVideojuego(long idVideojuego) {
        this.idVideojuego = idVideojuego;
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Videojuego)) return false;
        Videojuego that = (Videojuego) o;
        return idVideojuego == that.idVideojuego;
    }

    public void setGeneros(List<Genero> generos) {
        this.generos = generos;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    public void setCapturas(List<Captura> capturas) {
        this.capturas = capturas;
    }

    public List<Oferta> getOfertas() {
        return ofertas;
    }

    public void setOfertas(List<Oferta> ofertas) {
        this.ofertas = ofertas;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(idVideojuego);
    }

}
