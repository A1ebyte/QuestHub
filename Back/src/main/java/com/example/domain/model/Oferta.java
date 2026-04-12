package com.example.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Oferta {
    @Id
    private String idOferta;
    private long steamAppID;
    private String titulo;
    private double precioOferta; //salePrice
    private double precioOriginal; // normalPrice
    @Column(columnDefinition = "TEXT")
    private String urlCompra; //dealID
    private LocalDateTime inicioOferta;
    private double ofertaRating; //dealRating
    private double ahorro; //saving
    @Column(columnDefinition = "TEXT")
    private String thumb; //thumb
    @Column(columnDefinition = "TEXT")
    private String urlImagen=""; //thumbHD
    private int steamRating = 0;


    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Tienda")
    private Tienda tienda;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Videojuego")
    private Videojuego videojuego;

    public Oferta() {
    }

    public int getSteamRating() {
        return steamRating;
    }
    
    public Videojuego getVideojuego() {
		return videojuego;
	}

	public void setVideojuego(Videojuego videojuego) {
		this.videojuego = videojuego;
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
        return thumb;
    }

    public void setUrlImagen(String urlImagen) {
        this.thumb = urlImagen;
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

	public String getThumb() {
		return thumb;
	}

	public void setThumb(String thumb) {
		this.thumb = thumb;
	}

	public long getSteamAppID() {
		return steamAppID;
	}

	public void setSteamAppID(long steamAppID) {
		this.steamAppID = steamAppID;
	}
	
	
}
