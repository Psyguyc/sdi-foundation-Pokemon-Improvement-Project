let pokemonData = [];

async function fetchPokemon() {
    const pokemonArray = [];
    for (let i = 1; i <= 18; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const data = await response.json();
        pokemonArray.push({
            id: i,
            name: data.name,
            moves: data.moves,
            sprite: data.sprites.front_default,
            artwork: data.sprites.other['official-artwork'].front_default
        });
    }
    return pokemonArray;
}

function createHomePage(pokemonData) {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';
    pokemonData.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.sprite}" alt="${pokemon.name}" width="100" height="100">
        `;
        card.addEventListener('click', () => {
            window.location.hash = `pokemon/${pokemon.id}`;
        });
        grid.appendChild(card);
    });
}

function showPokemonPage(id) {
    const pokemon = pokemonData.find(p => p.id === parseInt(id));
    if (pokemon) {
        document.getElementById('pokemon-name').textContent = pokemon.name.toUpperCase();
        document.getElementById('pokemon-image').src = pokemon.artwork;
        document.getElementById('pokemon-image').alt = pokemon.name;
        const movesList = document.getElementById('pokemon-moves');
        movesList.innerHTML = '';
        const moves = pokemon.moves.slice(0, 5).map(move => move.move.name);
        moves.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            movesList.appendChild(li);
        });
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('pokemon-page').style.display = 'block';
    }
}

function showHomepage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('pokemon-page').style.display = 'none';
}

function handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#pokemon/')) {
        const id = hash.split('/')[1];
        showPokemonPage(id);
    } else {
        showHomepage();
    }
}

async function initialize() {
    pokemonData = await fetchPokemon();
    createHomePage(pokemonData);
    handleRouting();
}

window.addEventListener('hashchange', handleRouting);
initialize();