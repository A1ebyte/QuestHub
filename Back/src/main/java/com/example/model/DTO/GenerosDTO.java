package com.example.model.DTO;

import java.util.Map;

public class GenerosDTO {

	private Long storeID;
	private String storeName;
	private boolean active;
	private Map<String, String> images;

	public Long getStoreID() {
		return storeID;
	}

	public void setStoreID(Long storeID) {
		this.storeID = storeID;
	}

	public String getStoreName() {
		return storeName;
	}

	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}

	public boolean isActive() {
		return active;
	}

	public void setIsActive(int isActive) {
		this.active = isActive == 1;
	}

	public Map<String, String> getImages() {
		return images;
	}

	public void setImages(Map<String, String> images) {
		this.images = images;
	}

}
