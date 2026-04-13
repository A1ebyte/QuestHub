package com.example.domain.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Tienda {
    @Id
    private long idTienda;
    private String nombre;//storeName
    @Column(columnDefinition = "TEXT")
    private String logo;
    @Column(columnDefinition = "TEXT")
    private String banner;
    @Column(columnDefinition = "TEXT")
    private String icon;

    // --- Relacion ----
    @OneToMany(mappedBy = "tienda",cascade = CascadeType.REMOVE, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Oferta> ofertas = new ArrayList<>();


    public Tienda() {
    }


    public void agregarOfertas(Oferta oferta) {
        if (!ofertas.contains(oferta)) {
        	ofertas.add(oferta);
        	oferta.setTienda(this);
        }
    }

    public List<Oferta> getOferta() {
        return ofertas;
    }

    public long getIdTienda() {
        return idTienda;
    }

    public void setIdTienda(long idTienda) {
        this.idTienda = idTienda;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tienda)) return false;
        Tienda that = (Tienda) o;
        return idTienda == that.idTienda;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(idTienda);
    }
}
