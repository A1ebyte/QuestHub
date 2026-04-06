package com.example.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "oferta")
public class Oferta {
    @Id
    @Column(name = "id_oferta")
    private String idOferta;

    private String titulo;
    @Column(name = "precio_oferta")
    private double precioOferta; //salePrice
    @Column(name = "precio_original")
    private double precioOriginal; // normalPrice
    @Column(columnDefinition = "TEXT",name = "url_compra")
    private String urlCompra; //dealID
    @Column(name = "fecha_actualizacion")
    private LocalDateTime inicioOferta;
    private boolean estaEnOferta; //isOnSale
    @Column(name = "oferta_rating")
    private double ofertaRating; //dealRating
    private double ahorro; //saving
    @Column(columnDefinition = "TEXT")
    private String urlImagen; //thumb
    private int steamRating = 0;


    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tienda")
    private Tienda tienda;

    public Oferta() {
    }

    public int getSteamRating() {
        return steamRating;
    }

    public void setSteamRating(int steamRating) {
        this.steamRating = steamRating;
    }

    public String getIdOferta() {
        return idOferta;
    }

    public void setIdOferta(String idOferta) {
        this.idOferta = idOferta;
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

    public LocalDateTime getInicioOferta() {
        return inicioOferta;
    }

    public void setInicioOferta(LocalDateTime inicioOferta) {
        this.inicioOferta = inicioOferta;
    }

    public boolean isEstaEnOferta() {
        return estaEnOferta;
    }

    public void setEstaEnOferta(boolean estaEnOferta) {
        this.estaEnOferta = estaEnOferta;
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

    public String getUrlCompra() {
        return urlCompra;
    }

    public void setUrlCompra(String urlCompra) {
        this.urlCompra = urlCompra;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public Tienda getTienda() {
        return tienda;
    }

    public void setTienda(Tienda tienda) {
        this.tienda = tienda;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
}
