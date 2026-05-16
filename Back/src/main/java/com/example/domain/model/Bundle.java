package com.example.domain.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Bundle {
	@Id
	private long idBundle;
	private String nombre;
    @Column(columnDefinition = "TEXT")
    private String imagenUrl; //headerImage
    
    @OneToMany(mappedBy = "bundle", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BundleProductos> productos  = new HashSet<>();;
	
    @OneToMany(mappedBy = "bundle", fetch = FetchType.LAZY)
    private Set<Oferta> ofertas = new HashSet<>();
    
    @ManyToMany(mappedBy = "bundles")
    @JsonIgnore
    private Set<Wishlist> wishlists = new HashSet<>();

	public Bundle() {
	}
	
    public Set<Wishlist> getWishlists() {
        return wishlists;
    }

    public void setWishlists(Set<Wishlist> wishlists) {
        this.wishlists = wishlists;
    }
    
    public Set<Oferta> getOfertas() {
        return ofertas;
    }

    public void setOfertas(Set<Oferta> ofertas) {
        this.ofertas = ofertas;
    }
    
    public void addOferta(Oferta oferta) {
        ofertas.add(oferta);
        oferta.setBundle(this);
    }
    
    public Set<BundleProductos> getProductos() {
        return productos;
    }
    
    public void addProductos(BundleProductos producto) {
        productos.add(producto);
        producto.setBundle(this);
    }
    
    public void setProductos(Set<BundleProductos> producto) {
    	productos = producto;
    }
    
	public long getIdBundle() {
		return idBundle;
	}

	public void setIdBundle(long idBundle) {
		this.idBundle = idBundle;
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

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Bundle))
			return false;
		Bundle that = (Bundle) o;
		return idBundle == that.idBundle;
	}

	@Override
	public int hashCode() {
		return Long.hashCode(idBundle);
	}
}
