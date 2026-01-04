import "./App.css";
import { useEffect, useState } from "react";
import BookShelf from "./components/BookShelf";
import SearchPage from "./components/SearchPage";
import { getAll } from "./BooksAPI";

const SHELF_TITLES = {
  currentlyReading: "Currently Reading",
  wantToRead: "Want to Read",
  read: "Read",
};

function App() {
  const [books, setBooks] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAll()
      .then((fetchedBooks) => {
        if (!isMounted) return;

        const normalizedBooks = fetchedBooks.map((book) => ({
          ...book,
          cover: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail,
          dimensions: { width: 128, height: 193 },
        }));

        setBooks(normalizedBooks);
      })
      .catch((error) => {
        console.error("Failed to load books", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const shelves = Object.entries(SHELF_TITLES).map(([key, title]) => ({
    key,
    title,
    books: books.filter((book) => book.shelf === key),
  }));

  return (
    <div className="app">
      {showSearchPage ? (
        <SearchPage
          query={query}
          results={[]}
          onQueryChange={setQuery}
          onClose={() => setShowSearchPage(false)}
        />
      ) : (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              {shelves.map((shelf) => (
                <BookShelf
                  key={shelf.key}
                  title={shelf.title}
                  books={shelf.books}
                />
              ))}
            </div>
          </div>
          <div className="open-search">
            <button type="button" onClick={() => setShowSearchPage(true)}>
              Add a book
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
