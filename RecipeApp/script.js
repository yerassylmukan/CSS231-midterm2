const apiKey = "7f11b57982914e408720454dc7cad8c6";
const apiEndpoint = "https://api.spoonacular.com/recipes/";

let availableKeywords = [
  "pasta",
  "pizza",
  "salad",
  "soup",
  "vegan",
  "breakfast",
  "dinner",
  "dessert",
  "pie",
  "superfoods",
];
let latestResult = [];

const inputBox = document.getElementById("input-box");
const resultBox = document.getElementById("result-box");
const searchButton = document.getElementById("search-button");
const autocomplete = document.getElementById("autocomplete");
const gridContainer = document.getElementById("grid-container");

const modal = document.getElementById("recipe-modal");
const modalTitle = document.getElementById("modal-title");
const modalIngredients = document.getElementById("modal-ingredients");
const modalNutrition = document.getElementById("modal-nutrition");
const modalRating = document.getElementById("modal-rating");
const preparationTimes = document.getElementById("preparation-times");
const closeModalBtn = document.querySelector(".close-btn");

const favoriteBtn = document.getElementById("favorite-btn");

if (inputBox) {
  inputBox.onkeyup = function () {
    let result = [];
    let input = inputBox.value.trim().toLowerCase();

    if (input.length) {
      result = availableKeywords.filter((keyword) => {
        return keyword.toLowerCase().includes(input);
      });
    }

    latestResult = result;
    display(result);

    if (!result.length) {
      resultBox.innerHTML = "";
    }
  };

  function display(result) {
    const content = result.map((list) => {
      return "<li onclick=selectInput(this)>" + list + "</li>";
    });

    resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
  }

  function selectInput(list) {
    inputBox.value = list.textContent;
    resultBox.innerHTML = "";
  }

  async function searchRecipes(query) {
    gridContainer.innerHTML = "";

    try {
      const response = await fetch(
        `${apiEndpoint}complexSearch?query=${query}&apiKey=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        data.results.forEach((recipe) => {
          createRecipeCard(recipe);
        });
      } else {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found.";
        gridContainer.appendChild(noResultsMessage);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Failed to fetch recipes. Please try again later.";
      gridContainer.appendChild(errorMessage);
    }
  }

  async function createAutocompleteText(autocompleteData) {
    const text = document.createElement("p");
    text.textContent = `Did you mean ${autocompleteData.title}?`;
  
    autocomplete.appendChild(text);
  }
  
  async function autocompleteSearch(query) {
    autocomplete.innerHTML = "";
  
    try {
      const response = await fetch(
        `${apiEndpoint}autocomplete?number=1&query=${query}&apiKey=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.length > 0) {
        createAutocompleteText(data[0]);
      } else {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found.";
        autocomplete.appendChild(noResultsMessage);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Failed to fetch recipes. Please try again later.";
      autocomplete.appendChild(errorMessage);
    }
  }

  inputBox.addEventListener("focus", function () {
    if (latestResult.length) {
      display(latestResult);
    }
  });

  inputBox.addEventListener("blur", function () {
    setTimeout(function () {
      resultBox.innerHTML = "";
    }, 200);
  });

  searchButton.addEventListener("click", () => {
    const query = inputBox.value.trim();
    if (query) {
      searchRecipes(query);
      autocompleteSearch(query);
    }
  });
}

async function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = recipe.title;
  image.classList.add("recipe-image");

  const title = document.createElement("h2");
  title.textContent = recipe.title;

  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = "Click to see details";

  card.append(image, title, description);
  gridContainer.appendChild(card);

  card.addEventListener("click", () => openModal(recipe.id));
}

function addToFavorites() {
  const recipe = {
    id: modal.dataset.recipeId,
    title: modalTitle.textContent,
    image: modal.querySelector(".recipe-image").src,
  };

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.find(fav => fav.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Recipe added to favorites!");
  } else {
    alert("Recipe already in favorites!");
  }
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    gridContainer.innerHTML = "<p>No favorite recipes yet!</p>";
    return;
  }

  favorites.forEach((recipe) => createRecipeCard(recipe));
}

if (window.location.pathname.includes("favorites.html")) {
  document.addEventListener("DOMContentLoaded", loadFavorites);
}

async function openModal(recipeId) {
  try {
    const response = await fetch(
      `${apiEndpoint}${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    modal.dataset.recipeId = data.id;

    modalTitle.textContent = data.title;
    
    const recipeImage = document.createElement("img");
    recipeImage.src = data.image;
    recipeImage.alt = data.title;
    recipeImage.classList.add("recipe-image");
    
    modal.querySelector(".recipe-image")?.remove();
    modal.querySelector(".modal-content").prepend(recipeImage);

    modalIngredients.innerHTML = "<h3>Ingredients:</h3>";
    data.extendedIngredients.forEach((ingredient) => {
      const ingredientItem = document.createElement("p");
      ingredientItem.textContent = `${ingredient.original}`;
      modalIngredients.appendChild(ingredientItem);
    });

    modalNutrition.innerHTML = "<h3>Nutrition Information:</h3>";
    data.nutrition.nutrients.forEach((nutrient) => {
      const nutrientItem = document.createElement("p");
      nutrientItem.textContent = `${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`;
      modalNutrition.appendChild(nutrientItem);
    });

    preparationTimes.innerHTML = `<h3>Preparation Time:</h3><p>${data.readyInMinutes} minutes</p>`;
    modalRating.innerHTML = `<h3>Score:</h3><p>${parseInt(data.spoonacularScore, 10)}</p>`;

    modal.style.display = "flex";
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
}

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
