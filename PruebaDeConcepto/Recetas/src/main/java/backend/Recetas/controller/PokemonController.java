package backend.Recetas.controller;


import backend.Recetas.model.Pokemon;
import backend.Recetas.service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    @Autowired
    private PokemonService pokemonService;

    // GET por nombre - Busca en BD, si no existe llama a PokeAPI
    @GetMapping("/name/{name}")
    public ResponseEntity<Pokemon> getPokemonByName(@PathVariable String name) {
        try {
            Pokemon pokemon = pokemonService.findByName(name);
            return ResponseEntity.ok(pokemon);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET todos los Pokemon guardados en BD
    @GetMapping
    public ResponseEntity<List<Pokemon>> getAllPokemon() {
        List<Pokemon> pokemons = pokemonService.findAll();
        return ResponseEntity.ok(pokemons);
    }

    // GET por ID (solo busca en BD)
    @GetMapping("/{id}")
    public ResponseEntity<Pokemon> getPokemonById(@PathVariable Long id) {
        return pokemonService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Eliminar Pokemon de la BD
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePokemon(@PathVariable Long id) {
        try {
            pokemonService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}