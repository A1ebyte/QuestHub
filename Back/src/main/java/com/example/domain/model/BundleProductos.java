package com.example.domain.model;

import java.util.HashSet;
import java.util.Set;

import com.example.external.steam.DTOs.CapturaPreview;
import com.example.external.steam.DTOs.MoviePreview;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class BundleProductos {
    @Id
    private long steamAppId;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String imagenUrl;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Bundle")
    private Bundle bundle;
    
    @ElementCollection
    private Set<MoviePreview> movies = new HashSet<>();

    @ElementCollection
    private Set<CapturaPreview> capturas = new HashSet<>();


	public BundleProductos() {
		super();
	}

	public long getSteamAppId() {
		return steamAppId;
	}

	public void setSteamAppId(long steamAppId) {
		this.steamAppId = steamAppId;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}

	public Set<CapturaPreview> getCapturas() {
		return capturas;
	}

	public void addCapturas(CapturaPreview capturas) {
		this.capturas.add(capturas);
	}

	public Set<MoviePreview> getMovies() {
		return movies;
	}

	public void addMovies(MoviePreview movies) {
		this.movies.add(movies);
	}
}
