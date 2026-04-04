package com.example.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Oferta {
    @Id
    @Column(name = "id_oferta")
    private String idOferta;
    private double precio_oferta; //salePrice
    private double precio_original; // normalPrice
    private String url_compra; //dealID
    @Column(name = "fecha_actualizacion")
    private LocalDateTime inicioOferta;
    private boolean estaEnOferta; //isOnSale
    private double oferta_rating; //dealRating
    private double ahorro; //saving
    private String urlImagen; //thumb

    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tienda")
    private Tienda tienda;

    public Oferta() {
    }

    public String getIdOferta() {
        return idOferta;
    }

    public void setIdOferta(String idOferta) {
        this.idOferta = idOferta;
    }

    public double getPrecio_oferta() {
        return precio_oferta;
    }

    public void setPrecio_oferta(double precio_oferta) {
        this.precio_oferta = precio_oferta;
    }

    public double getPrecio_original() {
        return precio_original;
    }

    public void setPrecio_original(double precio_original) {
        this.precio_original = precio_original;
    }

    public String getUrlCompra() {
        return url_compra;
    }

    public void setUrlCompra(String urlCompra) {
        this.url_compra = urlCompra;
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

    public double getOferta_rating() {
        return oferta_rating;
    }

    public void setOferta_rating(double oferta_rating) {
        this.oferta_rating = oferta_rating;
    }

    public double getAhorro() {
        return ahorro;
    }

    public void setAhorro(double ahorro) {
        this.ahorro = ahorro;
    }

    public String getUrl_compra() {
        return url_compra;
    }

    public void setUrl_compra(String url_compra) {
        this.url_compra = url_compra;
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
}
