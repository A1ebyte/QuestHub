package com.example.model;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VideojuegosDTO {
    private int id;
    private String nombre;
    private String descripcion;
    private String imagen;
    private double rating;
    private List<String> plataformas;
    private List<OfertasDTO> ofertas;

    public VideojuegosDTO() {}

    public VideojuegosDTO(int id, String nombre, String descripcion, String imagen,
                         	double rating, List<String> plataformas) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.rating = rating;
        this.plataformas = plataformas;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getPlataformas() { return plataformas; }
    public void setPlataformas(List<String> plataformas) { this.plataformas = plataformas; }

    public List<OfertasDTO> getOfertas() { return ofertas; }
    public void setOfertas(List<OfertasDTO> ofertas) { this.ofertas = ofertas; }
}
