"use strict";
// Sample Library Database
const libraryBooks = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "fiction",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        genre: "sci-fi",
        coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "mystery",
        coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "Steve Jobs",
        author: "Walter Isaacson",
        genre: "biography",
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        title: "Neuromancer",
        author: "William Gibson",
        genre: "sci-fi",
        coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80"
    }
];
// Get DOM Elements with appropriate TypeScript Type Casting
const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
// Function to render books to the HTML grid
function displayBooks(books) {
    if (!bookGrid)
        return;
    // Clear existing content
    bookGrid.innerHTML = "";
    if (books.length === 0) {
        bookGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No books found matching your criteria.</p>`;
        return;
    }
    // Build cards dynamically
    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <span class="book-genre">${book.genre}</span>
            </div>
        `;
        bookGrid.appendChild(bookCard);
    });
}
// Function to filter and search books
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const filtered = libraryBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
    displayBooks(filtered);
}
// Attach event listeners for real-time updates
searchInput.addEventListener("input", filterBooks);
genreFilter.addEventListener("change", filterBooks);
// Initialize application by displaying all books on load
document.addEventListener("DOMContentLoaded", () => {
    displayBooks(libraryBooks);
});
