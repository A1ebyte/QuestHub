package com.example.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vista_ofertas")
public class VistaOfertas {

    @Id
    @Column(name = "id_oferta")
    private String idOferta;

    @Column(name = "steam_appid")
    private long steamAppID;

    private String titulo;

    @Column(name = "precio_oferta")
    private double precioOferta;

    @Column(name = "precio_original")
    private double precioOriginal;

    @Column(columnDefinition = "TEXT", name = "url_compra")
    private String urlCompra;

    @Column(name = "inicio_oferta")
    private LocalDateTime inicioOferta;

    @Column(name = "oferta_rating")
    private double ofertaRating;

    private double ahorro;

    @Column(columnDefinition = "TEXT")
    private String thumb;

    @Column(columnDefinition = "TEXT", name = "url_imagen")
    private String urlImagen;

    @Column(name = "steam_rating")
    private int steamRating;

    public VistaOfertas() {}

    // Getters y setters

    public String getIdOferta() {
        return idOferta;
    }

    public void setIdOferta(String idOferta) {
        this.idOferta = idOferta;
    }

    public long getSteamAppID() {
        return steamAppID;
    }

    public void setSteamAppID(long steamAppID) {
        this.steamAppID = steamAppID;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public double getPrecioOferta() {
        return precioOferta;
    }

    public void setPrecioOferta(double precioOferta) {
        this.precioOferta = precioOferta;
    }

    public double getPrecioOriginal() {
        return precioOriginal;
    }

    public void setPrecioOriginal(double precioOriginal) {
        this.precioOriginal = precioOriginal;
    }

    public String getUrlCompra() {
        return urlCompra;
    }

    public void setUrlCompra(String urlCompra) {
        this.urlCompra = urlCompra;
    }

    public LocalDateTime getInicioOferta() {
        return inicioOferta;
    }

    public void setInicioOferta(LocalDateTime inicioOferta) {
        this.inicioOferta = inicioOferta;
    }

    public double getOfertaRating() {
        return ofertaRating;
    }

    public void setOfertaRating(double ofertaRating) {
        this.ofertaRating = ofertaRating;
    }

    public double getAhorro() {
        return ahorro;
    }

    public void setAhorro(double ahorro) {
        this.ahorro = ahorro;
    }

    public String getThumb() {
        return thumb;
    }

    public void setThumb(String thumb) {
        this.thumb = thumb;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public int getSteamRating() {
        return steamRating;
    }

    public void setSteamRating(int steamRating) {
        this.steamRating = steamRating;
    }
}