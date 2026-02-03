const API_KEY = 'c33a1a7f82b09328d11cb7584c880072';
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Fetch Different Genres
const fetchMovies = async (url, elementId) => {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById(elementId);
    
    data.results.forEach(movie => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">`;
        div.onclick = () => openBooking(movie);
        container.appendChild(div);
    });
};

// Open Specific Booking
function openBooking(movie) {
    document.getElementById('modal-movie-title').innerText = movie.title;
    document.getElementById('modal-poster').src = IMG_URL + movie.poster_path;
    document.getElementById('booking-modal').classList.remove('hidden');
    generateSeats();
}

// Visual Confirmation Interaction
function executeBooking() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('success-overlay').classList.remove('hidden');
}

function closeSuccess() {
    document.getElementById('success-overlay').classList.add('hidden');
    location.reload(); // Reset the UI
}

// Load Data
const BASE = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY;
fetchMovies(`${BASE}&with_original_language=en`, 'hollywood-grid');
fetchMovies(`${BASE}&with_original_language=hi`, 'bollywood-grid');