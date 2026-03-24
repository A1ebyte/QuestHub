package backend.Recetas.service;


import backend.Recetas.PokemonRepository;
import backend.Recetas.model.Pokemon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;

@Service
public class PokemonService {

    private static final String POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Buscar por nombre: primero en BD, si no existe llama a la API
    public Pokemon findByName(String name) {
        String nameLower = name.toLowerCase();

        // 1. Buscar en la base de datos
        Optional<Pokemon> pokemonInDb = pokemonRepository.findByName(nameLower);

        if (pokemonInDb.isPresent()) {
            System.out.println("Pokemon encontrado en BASE DE DATOS: " + nameLower);
            return pokemonInDb.get();
        }

        // 2. Si no está en BD, llamar a la PokeAPI
        System.out.println("Pokemon NO encontrado en BD, llamando a PokeAPI: " + nameLower);
        Pokemon pokemonFromApi = fetchFromPokeApi(nameLower);

        // 3. IMPORTANTE: Eliminar el ID de la API para que se genere uno nuevo en BD
        pokemonFromApi.setId(null);

        // 4. Guardar en la base de datos
        Pokemon savedPokemon = pokemonRepository.save(pokemonFromApi);
        System.out.println("Pokemon guardado en BASE DE DATOS: " + savedPokemon.getName() + " con ID: " + savedPokemon.getId());

        return savedPokemon;
    }

    // Llamar a la PokeAPI
    private Pokemon fetchFromPokeApi(String name) {
        try {
            String url = POKEAPI_URL + name;
            System.out.println("Llamando a URL: " + url);

            Pokemon pokemon = restTemplate.getForObject(url, Pokemon.class);

            if (pokemon == null) {
                throw new RuntimeException("Pokemon no encontrado en PokeAPI: " + name);
            }

            System.out.println("Pokemon recibido de API: " + pokemon.getName() +
                    " | height: " + pokemon.getHeight() + " | weight: " + pokemon.getWeight());

            // La API devuelve height y weight en decímetros y hectogramos
            // Los convertimos a metros y kilogramos
            pokemon.setHeight(pokemon.getHeight() / 10.0);
            pokemon.setWeight(pokemon.getWeight() / 10.0);

            return pokemon;
        } catch (HttpClientErrorException.NotFound e) {
            System.out.println("ERROR: Pokemon no encontrado en PokeAPI: " + name);
            throw new RuntimeException("Pokemon no encontrado en PokeAPI: " + name);
        } catch (Exception e) {
            System.out.println("ERROR al llamar a PokeAPI: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al obtener Pokemon de PokeAPI: " + e.getMessage());
        }
    }

    // Obtener todos los Pokemon guardados en BD
    public List<Pokemon> findAll() {
        return pokemonRepository.findAll();
    }

    // Buscar por ID en la base de datos
    public Optional<Pokemon> findById(Long id) {
        return pokemonRepository.findById(id);
    }

    // Eliminar Pokemon de la BD
    public void deleteById(Long id) {
        if (!pokemonRepository.existsById(id)) {
            throw new RuntimeException("Pokemon no encontrado con id: " + id);
        }
        pokemonRepository.deleteById(id);
    }


}