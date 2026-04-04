package com.example.external.cheapshark.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
//Metodo records
public record OfertaDTO(
        String title,
    	String gameID,
        String steamAppID, //ForeignKey
        String dealID, //PrimaryKey
        String thumb,
        String lastChange, //reciente
        String steamRatingText,
        int storeID, //ForeignKey
        int isOnSale, //quitar?
        int steamRatingPercent,
        double dealRating,
        double salePrice,
        double normalPrice,
        double savings
) {}

//Metodo clasico
/*public class OfertasDTO{
	
	private String title;
	private String gameID;
	private String dealID;
	private String steamAppID;
	private String thumb;
	private int storeID;
	private double dealRating;
	private double salePrice;
	private double normalPrice;
	private double savings;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getGameID() {
		return gameID;
	}
	public void setGameID(String gameID) {
		this.gameID = gameID;
	}
	public String getDealID() {
		return dealID;
	}
	public void setDealID(String dealID) {
		this.dealID = dealID;
	}
	public String getSteamAppID() {
		return steamAppID;
	}
	public void setSteamAppID(String steamAppID) {
		this.steamAppID = steamAppID;
	}
	public String getThumb() {
		return thumb;
	}
	public void setThumb(String thumb) {
		this.thumb = thumb;
	}
	public int getStoreID() {
		return storeID;
	}
	public void setStoreID(int storeID) {
		this.storeID = storeID;
	}
	public double getDealRating() {
		return dealRating;
	}
	public void setDealRating(double dealRating) {
		this.dealRating = dealRating;
	}
	public double getSalePrice() {
		return salePrice;
	}
	public void setSalePrice(double salePrice) {
		this.salePrice = salePrice;
	}
	public double getNormalPrice() {
		return normalPrice;
	}
	public void setNormalPrice(double normalPrice) {
		this.normalPrice = normalPrice;
	}
	public double getSavings() {
		return savings;
	}
	public void setSavings(double savings) {
		this.savings = savings;
	}
	
	@Override
	public String toString() {
		return "OfertasDTO [title=" + title + ", gameID=" + gameID + ", dealID=" + dealID + ", steamAppID="
				+ steamAppID + ", thumb=" + thumb + ", storeID=" + storeID + ", dealRating=" + dealRating
				+ ", salePrice=" + salePrice + ", normalPrice=" + normalPrice + ", savings=" + savings + "]";
	}
}*/
