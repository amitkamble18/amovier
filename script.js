const API_KEY = 'c33a1a7f82b09328d11cb7584c880072';
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let selectedCount = 0;
const TICKET_PRICE = 250;

// Initialize sections
window.onload = () => {
    fetchMovies('/movie/popular', 'trending-grid');
    fetchMovies('/discover/movie?with_original_language=en', 'hollywood-grid');
    fetchMovies('/discover/movie?with_original_language=hi', 'bollywood-grid');
};

async function fetchMovies(endpoint, gridId) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`);
        const data = await res.json();
        renderMovies(data.results, gridId);
    } catch (err) {
        console.error("Error loading movies:", err);
    }
}

function renderMovies(movies, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    movies.slice(0, 6).forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <div class="card-body">
                <h4>${movie.title}</h4>
                <p><i class='bx bxs-star' style='color: #fbbf24'></i> ${movie.vote_average}</p>
            </div>
        `;
        card.onclick = () => openBooking(movie.title);
        grid.appendChild(card);
    });
}

function openBooking(title) {
    document.getElementById('modal-movie-title').innerText = title;
    document.getElementById('booking-modal').classList.remove('hidden');
    generateSeats();
}

function closeBooking() {
    document.getElementById('booking-modal').classList.add('hidden');
    selectedCount = 0;
    updateUI();
}

function generateSeats() {
    const seatGrid = document.getElementById('seat-grid');
    seatGrid.innerHTML = '';
    for (let i = 0; i < 48; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        if (Math.random() > 0.8) seat.classList.add('occupied');
        seat.onclick = () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
                updateUI();
            }
        };
        seatGrid.appendChild(seat);
    }
}

function updateUI() {
    selectedCount = document.querySelectorAll('.seat.selected').length;
    document.getElementById('count').innerText = selectedCount;
    document.getElementById('total').innerText = selectedCount * TICKET_PRICE;
    document.getElementById('book-btn').disabled = selectedCount === 0;
}

// The "Visual Booking" interaction
function confirmBooking() {
    // 1. Confetti burst
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ffffff', '#3b82f6']
    });

    // 2. Hide modal and show success toast
    closeBooking();
    const toast = document.getElementById('success-toast');
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}