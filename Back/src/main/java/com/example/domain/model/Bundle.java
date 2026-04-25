package com.example.domain.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.external.steam.DTOs.BundleInfoDTO;

import jakarta.persistence.ElementCollection;
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
	@ElementCollection
	private List<BundleInfoDTO> productos;

	@ManyToMany(mappedBy = "bundles")
	private Set<Videojuego> videojuegos = new HashSet<>();
	
    @OneToMany(mappedBy = "bundle", fetch = FetchType.LAZY)
    private Set<Oferta> ofertas = new HashSet<>();

	public Bundle() {
	}
	
    public List<BundleInfoDTO> getProductos() {
		return productos;
	}

	public void setProductos(List<BundleInfoDTO> productos) {
		this.productos = productos;
	}

	public void addVideojuego(Videojuego videojuego) {
        if (videojuegos.add(videojuego)) {
            videojuego.getBundles().add(this);
        }
    }
    
    public Set<Oferta> getOfertas() {
        return ofertas;
    }

    public void setOfertas(Set<Oferta> ofertas) {
        this.ofertas = ofertas;
    }
    
    public void addOferta(Oferta oferta) {
        if (!ofertas.contains(oferta)) {
            ofertas.add(oferta);
            oferta.setBundle(this);
        }
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

	public Set<Videojuego> getVideojuegos() {
		return videojuegos;
	}

	public void setVideojuegos(Set<Videojuego> videojuegos) {
		this.videojuegos = videojuegos;
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
