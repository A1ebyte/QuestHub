import { useState } from "react";

function Pokemon() {
  const [pokemon, setPokemon] = useState(null);

  const fetchPokemon = async () => {
    const res = await fetch("http://localhost:8080/api/pokemon/pikachu");
    const data = await res.json();
    setPokemon(data);
  };

  return (
    <div>
      <button onClick={fetchPokemon}>Cargar Pikachu</button>

      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
      )}
    </div>
  );
}

export default Pokemon;
