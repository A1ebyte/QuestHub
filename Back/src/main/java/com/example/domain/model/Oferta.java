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
    private int steamRating = 0;
    private boolean cambiarImg=true;


    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Tienda")
    private Tienda tienda;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Videojuego")
    private Videojuego videojuego;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Bundle")
    private Bundle bundle;

    public Oferta() {
    }

    public boolean isCambiarImg() {
		return cambiarImg;
	}

	public void setCambiarImg(boolean cambiarImg) {
		this.cambiarImg = cambiarImg;
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
	
    public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Oferta)) return false;
        Oferta that = (Oferta) o;
        return idOferta != null && idOferta.equals(that.idOferta);
    }

    @Override
    public int hashCode() {
        return idOferta != null ? idOferta.hashCode() : 0;
    }
}
