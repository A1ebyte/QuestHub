package com.example.domain.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Tienda {
    @Id
    @Column(name = "id_tienda")
    private Long idTienda;
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

    public Long getIdTienda() {
        return idTienda;
    }

    public void setIdTienda(Long idTienda) {
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
    public String toString() {
        final StringBuilder sb = new StringBuilder("Tienda{");
        sb.append("id_tienda=").append(idTienda);
        sb.append(", nombre='").append(nombre).append('\'');
        sb.append(", logo='").append(logo).append('\'');
        sb.append(", banner='").append(banner).append('\'');
        sb.append(", icon='").append(icon).append('\'');
        sb.append(", ofertas=").append(ofertas);
        sb.append('}');
        return sb.toString();
    }
}
