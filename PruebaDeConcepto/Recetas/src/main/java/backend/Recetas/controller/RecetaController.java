package backend.Recetas.controller;

import backend.Recetas.model.Receta;
import backend.Recetas.repository.RecetaRepository;
import backend.Recetas.service.RecetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recetas")
public class RecetaController {

    private RecetaRepository recetaRepository;

    public RecetaController(RecetaRepository recetaRepository) {
        this.recetaRepository = recetaRepository;
    }
    @Autowired
    private RecetaService recetaService;


    @GetMapping
    public List<Receta> obtenerTodas() {
        return recetaService.listarTodas();
    }


    @PostMapping
    public Receta crearReceta (@RequestBody Receta receta) {
        return recetaService.guardar(receta);
    }

    @GetMapping("/{id}")
    public Receta obtenerPorId(@PathVariable long id) {
        return recetaService.buscarPorId(id);
    }


    @DeleteMapping("/{id}")
    public void borrar(@PathVariable long id) {
        recetaService.eliminar(id);
    }
}
