package com.example.external.steam.DTOs;

import jakarta.persistence.Embeddable;

@Embeddable
public class CapturaPreview {

    private String miniatura;
    private String imagen;
    
	public String getMiniatura() {
		return miniatura;
	}
	public void setMiniatura(String miniatura) {
		this.miniatura = miniatura;
	}
	public String getImagen() {
		return imagen;
	}
	public void setImagen(String imagen) {
		this.imagen = imagen;
	}
    
    
}
