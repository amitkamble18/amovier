const API_KEY = 'c33a1a7f82b09328d11cb7584c880072';
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const grid = document.getElementById('movie-grid');
const search = document.getElementById('movie-search');
const modal = document.getElementById('booking-modal');
const seatGrid = document.getElementById('seat-grid');
const count = document.getElementById('count');
const total = document.getElementById('total');
const bookBtn = document.getElementById('book-btn');

let selectedCount = 0;
const TICKET_PRICE = 200;

// Fetch Movies
async function getMovies(endpoint) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);
        const data = await res.json();
        render(data.results);
    } catch (err) {
        console.error("API Fetch Error:", err);
    }
}

function render(movies) {
    grid.innerHTML = '';
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <div class="card-body">
                <h4>${movie.title}</h4>
                <p>⭐ ${movie.vote_average}</p>
            </div>
        `;
        card.onclick = () => openBooking(movie.title);
        grid.appendChild(card);
    });
}

// Seat Logic
function openBooking(title) {
    document.getElementById('modal-movie-title').innerText = title;
    modal.classList.remove('hidden');
    generateSeats();
}

function closeBooking() {
    modal.classList.add('hidden');
    selectedCount = 0;
    updateUI();
}

function generateSeats() {
    seatGrid.innerHTML = '';
    for (let i = 0; i < 48; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        // Randomly simulate occupied seats
        if (Math.random() > 0.8) seat.classList.add('occupied');
        
        seat.onclick = () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
                selectedCount = document.querySelectorAll('.seat.selected').length;
                updateUI();
            }
        };
        seatGrid.appendChild(seat);
    }
}

function updateUI() {
    count.innerText = selectedCount;
    total.innerText = selectedCount * TICKET_PRICE;
    bookBtn.disabled = selectedCount === 0;
}

// Search & Initial Load
search.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query) {
        getMovies(`/search/movie?query=${query}`);
    } else {
        getMovies('/movie/popular?language=en-US');
    }
});

getMovies('/movie/popular?language=en-US');
