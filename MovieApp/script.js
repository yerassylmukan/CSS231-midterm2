const apiKey = "2a6696742913200ba176cc7a25ba3adf";
const searchEndpoint = `https://api.themoviedb.org/3/search/movie`;
const movieEndpoint = `https://api.themoviedb.org/3/movie/`;
const imagePath = "https://image.tmdb.org/t/p/w500";

let availableKeywords = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Forrest Gump",
  "The Lord of the Rings: The Return of the King",
  "Inception",
  "Fight Club",
  "The Matrix",
  "The Empire Strikes Back",
  "The Godfather: Part II",
  "The Dark Knight Rises",
  "Schindler's List",
  "The Lord of the Rings: The Fellowship of the Ring",
  "Star Wars: A New Hope",
  "Goodfellas",
  "One Flew Over the Cuckoo's Nest",
  "The Silence of the Lambs",
  "Se7en",
  "City of God",
  "It's a Wonderful Life",
  "Life is Beautiful",
  "The Green Mile",
  "Parasite",
  "Interstellar",
  "The Lion King",
  "Back to the Future",
  "The Usual Suspects",
  "Spirited Away",
  "Saving Private Ryan",
  "Casablanca",
  "The Prestige",
  "The Departed",
  "Whiplash",
  "Gladiator",
  "The Shining",
  "The Intouchables",
  "Schindler's List",
  "12 Angry Men",
  "The Great Dictator",
  "The Dark Knight",
  "The Good, the Bad and the Ugly",
  "The Pianist",
  "Memento",
  "Jaws",
  "Citizen Kane",
  "Inglourious Basterds",
  "The Lord of the Rings: The Two Towers",
  "American History X",
  "The Breakfast Club",
  "Django Unchained",
  "The Social Network",
  "The Revenant",
  "The Wolf of Wall Street",
  "A Clockwork Orange",
  "The Matrix Reloaded",
  "Star Wars: Episode VI - Return of the Jedi",
  "Batman Begins",
  "The Truman Show",
  "The Big Lebowski",
  "Deadpool",
  "Titanic",
  "Star Wars: Episode I - The Phantom Menace",
  "The Hunger Games",
  "Avatar",
  "Joker",
  "The Avengers",
  "Guardians of the Galaxy",
  "Iron Man",
  "The Terminator",
  "Spider-Man: Into the Spider-Verse",
  "Thor: Ragnarok",
  "Frozen",
  "The Incredibles",
  "Shrek",
  "The Godfather: Part III",
  "The Hobbit: An Unexpected Journey",
  "The Lion King",
  "Toy Story",
  "The Dark Knight",
  "A Beautiful Mind",
  "Braveheart",
  "The Bridge on the River Kwai",
  "The Godfather",
  "Rocky",
  "E.T. the Extra-Terrestrial",
  "Good Will Hunting",
  "Requiem for a Dream",
  "The Departed",
  "No Country for Old Men",
  "The Prestige",
  "The Hunger Games: Catching Fire",
  "Mad Max: Fury Road",
  "The Conjuring",
  "Deadpool 2",
  "The Matrix Revolutions",
  "Spider-Man 2",
  "The Hobbit: The Battle of the Five Armies",
  "Guardians of the Galaxy Vol. 2",
  "Avatar 2",
  "Star Wars: Episode VII - The Force Awakens",
  "Iron Man 2",
  "X-Men: Days of Future Past",
  "Logan",
  "Spider-Man: Homecoming",
  "Doctor Strange",
  "The Magnificent Seven",
  "John Wick",
  "Trainspotting",
  "The Exorcist",
];
let latestResult = [];

const inputBox = document.getElementById("input-box");
const resultBox = document.getElementById("result-box");
const searchButton = document.getElementById("search-button");
const gridContainer = document.getElementById("grid-container");

const modal = document.getElementById("movie-modal");
const modalTitle = document.getElementById("modal-title");
const modalSynopsis = document.getElementById("modal-synopsis");
const modalRating = document.getElementById("modal-rating");
const modalRuntime = document.getElementById("modal-runtime");
const modalCast = document.getElementById("modal-cast");
const modalCrew = document.getElementById("modal-crew");
const closeModalBtn = document.querySelector(".close-btn");

const wishlistBtn = document.getElementById("wishlist-btn");

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

  async function searchMovies(query) {
    gridContainer.innerHTML = "";

    try {
      const response = await fetch(
        `${searchEndpoint}?query=${query}&api_key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        data.results.forEach((movie) => {
          movie.poster_path = imagePath + movie.poster_path;
          createMovieCard(movie);
        });
      } else {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No results found.";
        gridContainer.appendChild(noResultsMessage);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Failed to fetch movies. Please try again later.";
      gridContainer.appendChild(errorMessage);
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
      searchMovies(query);
    }
  });
}

async function createMovieCard(movie) {
  let id = movie.id;
  let poster = movie.poster_path;
  let movieTitle = movie.title;
  let movieReleaseDate = movie.release_date;

  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = poster;
  image.alt = movieTitle;
  image.classList.add("movie-image");

  const title = document.createElement("h2");
  title.textContent = movieTitle;

  const releaseDate = document.createElement("p");
  releaseDate.classList.add("release-date");
  releaseDate.textContent = movieReleaseDate;

  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = "Click to see details";

  card.append(image, title, releaseDate, description);
  gridContainer.appendChild(card);

  let synopsis = movie.overview;
  let rating = parseInt(movie.popularity, 10);

  card.addEventListener("click", () => openModal(id, synopsis, rating));
}

function addToWishlist() {
  const movie = {
    id: modal.dataset.movieId,
    poster_path: modal.querySelector(".movie-image").src,
    title: modalTitle.textContent,
    release_date: modal.querySelector(".release-date").textContent,
  };

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!wishlist.find((wish) => wish.id === movie.id)) {
    wishlist.push(movie);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Movie added to wishlist!");
  } else {
    alert("Movie already in wishlist!");
  }
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    gridContainer.innerHTML = "<p>No movie in wishlist yet!</p>";
    return;
  }

  wishlist.forEach((movie) => createMovieCard(movie));
}

if (window.location.pathname.includes("wishlist.html")) {
  document.addEventListener("DOMContentLoaded", loadWishlist);
}

async function openModal(movieId, synopsis, rating) {
  try {
    const detailsResponse = await fetch(
      `${movieEndpoint}${movieId}?&api_key=${apiKey}`
    );

    if (!detailsResponse.ok) {
      throw new Error(`HTTP error! Status: ${detailsResponse.status}`);
    }

    let details = await detailsResponse.json();

    const creditResponse = await fetch(
      `${movieEndpoint}${movieId}/credits?&api_key=${apiKey}`
    );

    if (!creditResponse.ok) {
      throw new Error(`HTTP error! Status: ${creditResponse.status}`);
    }

    let credit = await creditResponse.json();

    modal.dataset.movieId = details.id;

    modalTitle.textContent = details.original_title;

    const movieImage = document.createElement("img");
    movieImage.src = imagePath + details.poster_path;
    movieImage.alt = details.original_title;
    movieImage.classList.add("movie-image");

    modal.querySelector(".movie-image")?.remove();
    modal.querySelector(".modal-content").prepend(movieImage);

    modalSynopsis.textContent = synopsis;

    modalRating.textContent = `Rating: ${rating}`;

    modalRuntime.textContent = `Runtime: ${details.runtime} mins`;

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("release-date");
    releaseDate.textContent = details.release_date;
    modal.appendChild(releaseDate);

    modalCast.innerHTML = "<h3>Cast:</h3>";
    credit.cast.forEach((castPerson) => {
      const castItem = document.createElement("p");
      castItem.textContent = `${castPerson.name}`;
      modalCast.appendChild(castItem);
    });

    modalCrew.innerHTML = "<h3>Crew:</h3>";
    credit.crew.forEach((crewPerson) => {
      const crewItem = document.createElement("p");
      crewItem.textContent = `${crewPerson.name}`;
      modalCrew.appendChild(crewItem);
    });

    modal.style.display = "flex";
  } catch (error) {
    console.error("Error fetching movie details:", error);
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