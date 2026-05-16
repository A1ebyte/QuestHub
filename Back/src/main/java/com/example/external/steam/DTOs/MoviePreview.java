package com.example.external.steam.DTOs;

import jakarta.persistence.Embeddable;

@Embeddable
public class MoviePreview {

    private String miniatura;
    private String video;
    
	public String getMiniatura() {
		return miniatura;
	}
	public void setMiniatura(String miniatura) {
		this.miniatura = miniatura;
	}
	public String getVideo() {
		return video;
	}
	public void setVideo(String video) {
		this.video = video;
	}
    
    
}
