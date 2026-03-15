package backend.Recetas.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Receta {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String nombre;
    private String autor;
    private int tiempoCocina;

    @ElementCollection
    private List<String> ingredientes;

    @Column(length = 2000)
    private String paso;
}
