package com.example.external.cheapshark.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OfertaDTO(
        String title,
    	long gameID,
        String steamAppID, //ForeignKey
        String dealID, //PrimaryKey
        String thumb,
        long lastChange, //reciente
        String steamRatingText,
        long storeID, //ForeignKey
        int isOnSale, //quitar?
        int steamRatingPercent,
        double dealRating,
        double salePrice,
        double normalPrice,
        double savings
) {}