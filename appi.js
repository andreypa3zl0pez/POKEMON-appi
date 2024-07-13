document.addEventListener("DOMContentLoaded", () => {
  async function fetchData() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
    const pokemonUrls = [];

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      pokemonUrls.push(...data.results.map(pokemon => pokemon.url));

      const pokemonDetails = await Promise.all(
        pokemonUrls.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
      );

      // Obtener información adicional de cada Pokémon
      const pokemonSpecies = await Promise.all(
        pokemonDetails.map(async (pokemon) => {
          const response = await fetch(pokemon.species.url);
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          const speciesData = await response.json();
          return speciesData;
        })
      );

      // Mostrar detalles en el DOM
      displayPokemonDetails(pokemonDetails, pokemonSpecies);

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  function displayPokemonDetails(pokemonDetails, pokemonSpecies) {
    const container = document.getElementById('pokemon-container');

    pokemonDetails.forEach((pokemon, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="card-content">
          <h2>${pokemon.name}</h2>
          <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p>Weight: ${pokemon.weight}</p>
          <p>Height: ${pokemon.height}</p>
          <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p>Egg Groups: ${pokemonSpecies[index].egg_groups.map(group => group.name).join(', ')}</p>
          <p>Species: ${pokemonSpecies[index].genera.find(genus => genus.language.name === 'en').genus}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  fetchData();
});

