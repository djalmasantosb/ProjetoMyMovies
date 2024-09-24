const searchButton = document.getElementById('search-button');
const overlay = document.getElementById('modal-overlay');
const movieName = document.getElementById('movie-name');
const movieYear = document.getElementById('movie-year');
const movieListContainer = document.getElementById('movie-list');

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function searchButtonClickHandler() {
  try {
    let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('data: ', data);
    if (data.Error) {
      throw new Error('Movie not found.');
    }
    createModal(data);
    overlay.classList.add('open');
  } catch (error) {
    notie.alert({ type: 'error', text: error.message });
  }
}

function movieNameParameterGenerator() {
  if (movieName.value === '') {
    throw new Error('The name of the film must be provided.');
  }
  return movieName.value.split(' ').join('+');
}

function movieYearParameterGenerator() {
  if (movieYear.value === '') {
    return '';
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error('Invalid film year.');
  }
  return `&y=${movieYear.value}`;
}

function addToList(movieObject) {
  movieList.push(movieObject);
}

function removeToList(id) {
  notie.confirm({
    text: 'Do you want to remove the movie from your list?',
    position: 'top',
    submitCallback: function remove() {
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      document.getElementById(`movie-card-${id}`).remove();
      updateLocalStorage();
    },
  });
}

function isMovieAlreadyOnList(id) {
  function doesThisIdBelongToThisMovie(movieObject) {
    return movieObject.imdbID === id;
  }
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
}

function updateUI(movieObject) {
  movieListContainer.innerHTML += `<article id='movie-card-${movieObject.imdbID}'>
  <img
    src=${movieObject.Poster}
    alt="Poster de ${movieObject.Title}."
  />
  <button class="remove-button" onclick="{removeToList('${movieObject.imdbID}')}"><i class="bi bi-trash"></i> Remove</button>
</article>
  `;
}

function updateLocalStorage() {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

for (const movieInfo of movieList) {
  updateUI(movieInfo);
}

searchButton.addEventListener('click', searchButtonClickHandler);
