package com.example.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "usuario")
public class Usuario {

	@Id
	@Column(name = "id_usuario")
	private UUID idUsuario; // Este será el UUID de Supabase
	private boolean recibirNotificaciones = true;
	private String email;
	@OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
	private Wishlist wishlist;

	public Usuario() {
	}

	public Usuario(UUID idUsuario, String email) {
		this.idUsuario = idUsuario;
		this.email = email;
	}

	public UUID getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(UUID idUsuario) {
		this.idUsuario = idUsuario;
	}

	public Wishlist getWishlist() {
		return wishlist;
	}

	public void setWishlist(Wishlist wishlist) {
		this.wishlist = wishlist;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isRecibirNotificaciones() {
		return recibirNotificaciones;
	}

	public void setRecibirNotificaciones(boolean recibirNotificaciones) {
		this.recibirNotificaciones = recibirNotificaciones;
	}
}