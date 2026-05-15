package com.example.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_wishlist")
    private Long id;
    
    @OneToOne
    @JoinColumn(
        name = "user_id",
        referencedColumnName = "id_usuario",
        unique = true,
        nullable = false
    )
    @JsonIgnore
    private Usuario usuario;

    @ManyToMany
    @JoinTable(
        name = "wishlist_videojuegos",
        joinColumns = @JoinColumn(name = "id_wishlist"),
        inverseJoinColumns = @JoinColumn(name = "id_videojuego")
    )
    private Set<Videojuego> videojuegos = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "wishlist_bundles",
        joinColumns = @JoinColumn(name = "id_wishlist"),
        inverseJoinColumns = @JoinColumn(name = "id_bundle")
    )
    private Set<Bundle> bundles = new HashSet<>();

    @Column(name = "fecha_agregado")
    private LocalDateTime fechaAgregado = LocalDateTime.now();

    public void addVideojuego(Videojuego v) {
        videojuegos.add(v);
    }

    public void addBundle(Bundle b) {
        bundles.add(b);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
		usuario.setWishlist(this);
	}

	public LocalDateTime getFechaAgregado() {
        return fechaAgregado;
    }

    public void setFechaAgregado(LocalDateTime fechaAgregado) {
        this.fechaAgregado = fechaAgregado;
    }

    public Set<Videojuego> getVideojuegos() {
        return videojuegos;
    }

    public void setVideojuegos(Set<Videojuego> videojuegos) {
        this.videojuegos = videojuegos;
    }

    public Set<Bundle> getBundles() {
        return bundles;
    }

    public void setBundles(Set<Bundle> bundles) {
        this.bundles = bundles;
    }
}
