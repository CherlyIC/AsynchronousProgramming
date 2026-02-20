const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const loadingDiv = document.querySelector("#loading");
const pokemonCard = document.querySelector("#pokemon-card");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;
  fetchPokemon(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

async function fetchPokemon(query) {
  searchBtn.disabled = true;
  loadingDiv.classList.remove("hidden");
  pokemonCard.innerHTML = "";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if (!response.ok) {
      throw new Error(`Pokémon "${query}" not found. Try another name or ID.`);
    }

    const data = await response.json();
    displayPokemon(data);

  } catch (error) {
    displayError(error.message);

  } finally {
    loadingDiv.classList.add("hidden");
    searchBtn.disabled = false;
  }
}

function displayPokemon(data) {
  const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const id = `#${String(data.id).padStart(3, "0")}`;
  const height = (data.height / 10).toFixed(1) + " m";
  const weight = (data.weight / 10).toFixed(1) + " kg";
  const baseExp = data.base_experience;
  const types = data.types.map((t) => t.type.name);
  const frontSprite = data.sprites.front_default;
  const backSprite = data.sprites.back_default;
  const frontShiny = data.sprites.front_shiny;

  const card = document.createElement("div");
  card.className = "mt-4 rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-gradient-to-b from-blue-50 to-white";

  const spritesHTML = `
    <div class="flex justify-center gap-4 bg-gray-100 py-4">
      ${frontSprite ? `<img src="${frontSprite}" alt="${name} front" class="w-24 h-24" title="Front"/>` : ""}
      ${backSprite  ? `<img src="${backSprite}"  alt="${name} back"  class="w-24 h-24" title="Back"/>` : ""}
      ${frontShiny  ? `<img src="${frontShiny}"  alt="${name} shiny" class="w-24 h-24" title="Shiny"/>` : ""}
    </div>
  `;

  const typeBadgesHTML = types
    .map((type) => {
      const color = typeColor(type);
      return `<span class="px-3 py-1 rounded-full text-white text-xs font-bold uppercase ${color}">${type}</span>`;
    })
    .join("");

  const statsHTML = `
    <div class="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-600">
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <p class="font-semibold text-gray-400 text-xs uppercase">Height</p>
        <p class="font-bold text-gray-700 text-base mt-1">${height}</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <p class="font-semibold text-gray-400 text-xs uppercase">Weight</p>
        <p class="font-bold text-gray-700 text-base mt-1">${weight}</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <p class="font-semibold text-gray-400 text-xs uppercase">Base EXP</p>
        <p class="font-bold text-gray-700 text-base mt-1">${baseExp}</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <p class="font-semibold text-gray-400 text-xs uppercase">ID</p>
        <p class="font-bold text-gray-700 text-base mt-1">${id}</p>
      </div>
    </div>
  `;

  card.innerHTML = `
    ${spritesHTML}
    <div class="p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-extrabold text-gray-800">${name}</h2>
        <span class="text-gray-400 font-mono text-lg">${id}</span>
      </div>
      <div class="flex gap-2 flex-wrap mb-2">
        ${typeBadgesHTML}
      </div>
      ${statsHTML}
    </div>
  `;

  pokemonCard.appendChild(card);
}

function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "mt-4 bg-red-50 border border-red-300 text-red-700 rounded-xl p-5 text-center";
  errorDiv.innerHTML = `
    <p class="text-2xl mb-2">😵</p>
    <p class="font-semibold">${message}</p>
    <p class="text-sm mt-1 text-red-500">Check the spelling or try a Pokémon ID number.</p>
  `;
  pokemonCard.appendChild(errorDiv);
}

function typeColor(type) {
  const colors = {
    fire:     "bg-orange-500",
    water:    "bg-blue-500",
    grass:    "bg-green-500",
    electric: "bg-yellow-400",
    psychic:  "bg-pink-500",
    ice:      "bg-cyan-400",
    dragon:   "bg-indigo-600",
    dark:     "bg-gray-700",
    fairy:    "bg-pink-300",
    fighting: "bg-red-700",
    flying:   "bg-sky-400",
    poison:   "bg-purple-500",
    ground:   "bg-yellow-600",
    rock:     "bg-yellow-800",
    bug:      "bg-lime-500",
    ghost:    "bg-violet-600",
    steel:    "bg-slate-400",
    normal:   "bg-gray-400",
  };
  return colors[type] || "bg-gray-400";
}