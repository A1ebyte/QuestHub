package backend.Recetas.service;

import backend.Recetas.model.Receta;
import backend.Recetas.repository.RecetaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecetaService {
    private RecetaRepository recetaRepository;

    public RecetaService(RecetaRepository recetaRepository) {
        this.recetaRepository = recetaRepository;
    }

    public List<Receta> listarTodas() {
        return recetaRepository.findAll();
    }

    public Receta guardar(Receta receta) {
        return recetaRepository.save(receta);
    }

    public Receta buscarPorId(Long id) {
        return recetaRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        recetaRepository.deleteById(id);
    }
}
