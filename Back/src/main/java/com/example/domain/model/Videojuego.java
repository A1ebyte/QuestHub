package com.example.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "videojuego")
public class Videojuego {


    @Column(name = "id_videojuego")
    @Id
    private Long idVideojuegos;


    @Column(name = "imagen_url",columnDefinition = "TEXT")
    private String imagenUrl; //headerImage
    @Column(columnDefinition = "TEXT")
    private String imagenUrlResolucionBaja; //capsule_img
   // private String capturaDePantalla; //screenshots

    private String nombre;
    private int steamRatingPercent; //se llama desde oferta
    private LocalDate fechaLanzamiento; //release_date
    private String genero; // otro DTO
    @Column(columnDefinition = "TEXT")
    private String descripcion; // detailed_description
    @Column(columnDefinition = "TEXT")
    private String descripcionCorta; //short_description
    @Column(columnDefinition = "TEXT")
    private String acercaDe; //about_the_game
    private String desarolladores; //developer
    private String distribuidora; //punishers

    @Column(columnDefinition = "TEXT")
    private String pelicula; //movies


    public Videojuego() {
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

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
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

    public String getPelicula() {
        return pelicula;
    }

    public void setPelicula(String pelicula) {
        this.pelicula = pelicula;
    }
}
