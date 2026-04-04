package com.example.domain.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Tienda {
    @Id
    private Long id_tienda;
    private String nombre;//storeName
    @Column(columnDefinition = "TEXT")
    private String logo;
    @Column(columnDefinition = "TEXT")
    private String banner;
    @Column(columnDefinition = "TEXT")
    private String icon;

    // --- Relacion ----
    @OneToMany(mappedBy = "tienda",cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Oferta> ofertas = new ArrayList<>();


    public Tienda() {
    }


    public void agregarOfertas(Oferta oferta) {
        ofertas.add(oferta);
    }

    public List<Oferta> getOferta() {
        return ofertas;
    }

    public Long getId_tienda() {
        return id_tienda;
    }

    public void setId_tienda(Long id_tienda) {
        this.id_tienda = id_tienda;
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
    public String toString() {
        final StringBuilder sb = new StringBuilder("Tienda{");
        sb.append("id_tienda=").append(id_tienda);
        sb.append(", nombre='").append(nombre).append('\'');
        sb.append(", logo='").append(logo).append('\'');
        sb.append(", banner='").append(banner).append('\'');
        sb.append(", icon='").append(icon).append('\'');
        sb.append(", ofertas=").append(ofertas);
        sb.append('}');
        return sb.toString();
    }
}
