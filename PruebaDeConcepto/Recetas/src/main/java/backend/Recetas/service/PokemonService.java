package backend.Recetas.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PokemonService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getPokemon(String name) {
        String url = "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase();
        return restTemplate.getForObject(url, Object.class);
    }
}
