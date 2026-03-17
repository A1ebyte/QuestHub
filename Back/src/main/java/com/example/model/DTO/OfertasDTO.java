package com.example.model.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OfertasDTO {
    private String tienda;
    private double precio;
    private String url;
    private String fechaInicio;
    private String fechaFin;

    public OfertasDTO() {}

    public OfertasDTO(String tienda, double precio, String url, String fechaInicio, String fechaFin) {
        this.tienda = tienda;
        this.precio = precio;
        this.url = url;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    // Getters y Setters
    public String getTienda() { return tienda; }
    public void setTienda(String tienda) { this.tienda = tienda; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }

    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }
}
