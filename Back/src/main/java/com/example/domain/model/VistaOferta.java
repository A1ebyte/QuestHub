package com.example.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mv_ofertas_unicas")
public class VistaOferta {

    @Id
    @Column(name = "steam_appid")
    private long steamAppId;
    private String titulo;
    private double precioOferta;
    private double ahorro;
    private double ofertaRating;
    private int reviews;
    private LocalDateTime recent;
    @Column(columnDefinition = "TEXT")
    private String imagen;
    
	public long getSteamAppId() {
		return steamAppId;
	}
	public void setSteamAppId(long steamAppId) {
		this.steamAppId = steamAppId;
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
	public double getAhorro() {
		return ahorro;
	}
	public void setAhorro(double ahorro) {
		this.ahorro = ahorro;
	}
	public double getOfertaRating() {
		return ofertaRating;
	}
	public void setOfertaRating(double ofertaRating) {
		this.ofertaRating = ofertaRating;
	}
	public int getReviews() {
		return reviews;
	}
	public void setReviews(int reviews) {
		this.reviews = reviews;
	}
	public LocalDateTime getRecent() {
		return recent;
	}
	public void setRecent(LocalDateTime recent) {
		this.recent = recent;
	}
	public String getImagen() {
		return imagen;
	}
	public void setImagen(String imagen) {
		this.imagen = imagen;
	}
}

