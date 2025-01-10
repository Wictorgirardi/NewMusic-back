import axios from "axios";
import { Pokemon } from "../interfaces/pokemon";

const BASE_URL = process.env.POKEMON_API!;
const IMAGE_URL = process.env.POKEMON_IMAGE_API!;

export const fetchPokemons = async (
  limit: number,
  offset: number,
  search?: string
): Promise<Pokemon[]> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/pokedex/2/`);

    const kantoPokemonEntries = data.pokemon_entries.map((entry: any) => ({
      name: entry.pokemon_species.name,
      number: entry.entry_number,
    }));

    const filteredPokemons = search
      ? kantoPokemonEntries.filter(
          (pokemon: any) =>
            pokemon.name.includes(search.toLowerCase()) ||
            pokemon.number.toString() === search
        )
      : kantoPokemonEntries;

    const paginatedPokemons = filteredPokemons.slice(offset, offset + limit);

    const pokemonsWithImages = paginatedPokemons.map((pokemon: any) => ({
      ...pokemon,
      image_url: `${IMAGE_URL}/${pokemon.number}.png`,
    }));

    return pokemonsWithImages;
  } catch (error: any) {
    console.error("Erro ao buscar pokemons:", error.message);
    throw new Error("Erro ao buscar pokemons.");
  }
};
