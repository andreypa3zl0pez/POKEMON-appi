document.addEventListener("DOMContentLoaded", () => {
    async function Appi() {
      const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
      const arreglo1 = [];
  
      try {
        const response = await fetch(url);
        console.log(response.status);
  
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
  
        const data = await response.json();
        data.results.forEach(element => {
          arreglo1.push(element.url);
        });
  
        console.log(arreglo1); // Imprimir el contenido del arreglo
  
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(arreglo1.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        }));
  
        // Mostrar detalles en el DOM
        displayPokemonDetails(pokemonDetails);
  
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
  
    function displayPokemonDetails(pokemonDetails) {
      const container = document.getElementById('pokemon-container');
  
      pokemonDetails.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <div class="card-content">
            <h2>${pokemon.name}</h2>
            <p>Weight: ${pokemon.weight}</p>
            <p>Height: ${pokemon.height}</p>
          </div>
        `;
        container.appendChild(card);
      });
    }
  
    Appi();
  });
  