interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    rating: number;
    coverUrl: string;
    isAvailable: boolean;
}

// Stateful data storage for real-time reactivity
const initialBooks: Book[] = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "fiction",
        year: 2020,
        rating: 4.3,
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
        isAvailable: true
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        genre: "sci-fi",
        year: 1965,
        rating: 4.7,
        coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
        isAvailable: true
    },
    {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "mystery",
        year: 2019,
        rating: 4.1,
        coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
        isAvailable: false
    },
    {
        id: 4,
        title: "Steve Jobs",
        author: "Walter Isaacson",
        genre: "biography",
        year: 2011,
        rating: 4.6,
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
        isAvailable: true
    },
    {
        id: 5,
        title: "Neuromancer",
        author: "William Gibson",
        genre: "sci-fi",
        year: 1984,
        rating: 4.4,
        coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80",
        isAvailable: true
    },
    {
        id: 6,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "fantasy",
        year: 1937,
        rating: 4.9,
        coverUrl: "https://images.unsplash.com/photo-1629992101753-56d196c8add2?auto=format&fit=crop&w=400&q=80",
        isAvailable: true
    }
];

// App State
class PortalState {
    public books: Book[] = [...initialBooks];
    public favorites: number[] = []; // Array of Book IDs
    public borrowed: number[] = [];  // Array of Book IDs
}

const state = new PortalState();

// DOM Node References
const bookGrid = document.getElementById("book-grid") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
const favoritesList = document.getElementById("favorites-list") as HTMLUListElement;
const borrowedList = document.getElementById("borrowed-list") as HTMLUListElement;
const borrowedCount = document.getElementById("borrowed-count") as HTMLElement;
const favoritesCount = document.getElementById("favorites-count") as HTMLElement;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;

// Display Catalog Books
function renderCatalog(): void {
    if (!bookGrid) return;
    bookGrid.innerHTML = "";

    const filtered = state.books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesGenre = genreFilter.value === "all" || book.genre === genreFilter.value;
        return matchesSearch && matchesGenre;
    });

    if (filtered.length === 0) {
        bookGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No books found.</p>`;
        return;
    }

    filtered.forEach(book => {
        const isFav = state.favorites.includes(book.id);
        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${book.id})">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
            <div class="book-info">
                <div class="book-meta">
                    <span>${book.genre.toUpperCase()}</span>
                    <span>${book.year}</span>
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-rating">★ ${book.rating} / 5</div>
                <div class="card-footer">
                    <span class="status-badge ${book.isAvailable ? 'available' : 'borrowed'}">
                        ${book.isAvailable ? 'Available' : 'On Loan'}
                    </span>
                    <button 
                        class="btn-borrow ${book.isAvailable ? 'available' : 'borrowed'}"
                        onclick="borrowBook(${book.id})"
                        ${book.isAvailable ? '' : 'disabled'}
                    >
                        ${book.isAvailable ? 'Borrow' : 'Checked Out'}
                    </button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

// Side Panels Renderer
function renderDashboards(): void {
    // Render Favorites
    favoritesList.innerHTML = "";
    const favBooks = state.books.filter(b => state.favorites.includes(b.id));
    if (favBooks.length === 0) {
        favoritesList.innerHTML = `<li class="empty-msg">No favorited books yet.</li>`;
    } else {
        favBooks.forEach(b => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${b.title}</span><button onclick="toggleFavorite(${b.id})">×</button>`;
            favoritesList.appendChild(li);
        });
    }
    favoritesCount.innerText = state.favorites.length.toString();

    // Render Borrowed
    borrowedList.innerHTML = "";
    const borrowedBooks = state.books.filter(b => state.borrowed.includes(b.id));
    if (borrowedBooks.length === 0) {
        borrowedList.innerHTML = `<li class="empty-msg">You haven't borrowed anything yet.</li>`;
    } else {
        borrowedBooks.forEach(b => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${b.title}</span><button onclick="returnBook(${b.id})">Return</button>`;
            borrowedList.appendChild(li);
        });
    }
    borrowedCount.innerText = state.borrowed.length.toString();
}

// Global actions exposed safely to global scope via window mapping
(window as any).toggleFavorite = (id: number) => {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) {
        state.favorites.splice(idx, 1);
    } else {
        state.favorites.push(id);
    }
    renderCatalog();
    renderDashboards();
};

(window as any).borrowBook = (id: number) => {
    const book = state.books.find(b => b.id === id);
    if (book && book.isAvailable) {
        book.isAvailable = false;
        state.borrowed.push(id);
        renderCatalog();
        renderDashboards();
    }
};

(window as any).returnBook = (id: number) => {
    const book = state.books.find(b => b.id === id);
    if (book) {
        book.isAvailable = true;
        state.borrowed = state.borrowed.filter(bid => bid !== id);
        renderCatalog();
        renderDashboards();
    }
};

// Event Listeners
searchInput.addEventListener("input", renderCatalog);
genreFilter.addEventListener("change", renderCatalog);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// App Initiation
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
    renderDashboards();
});