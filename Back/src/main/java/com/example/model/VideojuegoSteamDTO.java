package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VideojuegoSteamDTO {
	private String name;
    private String type;
    private String short_description;
	
	public VideojuegoSteamDTO(String name, String type, String short_description) {
		super();
		this.name = name;
		this.type = type;
		this.short_description = short_description;
	}
    
    public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	public String getShort_description() {
		return short_description;
	}
	public void setShort_description(String short_description) {
		this.short_description = short_description;
	}
    
}
