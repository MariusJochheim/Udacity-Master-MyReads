import "./App.css";
import { useEffect, useState } from "react";
import BookShelf from "./components/BookShelf";
import SearchPage from "./components/SearchPage";
import { getAll, update } from "./BooksAPI";

const SHELF_TITLES = {
  currentlyReading: "Currently Reading",
  wantToRead: "Want to Read",
  read: "Read",
};

const normalizeBook = (book) => ({
  ...book,
  cover: book.cover || book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail,
  dimensions: book.dimensions || { width: 128, height: 193 },
});

function App() {
  const [books, setBooks] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAll()
      .then((fetchedBooks) => {
        if (!isMounted) return;

        const normalizedBooks = fetchedBooks.map(normalizeBook);

        setBooks(normalizedBooks);
      })
      .catch((error) => {
        console.error("Failed to load books", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMoveBook = async (book, newShelf) => {
    try {
      await update(book, newShelf);

      setBooks((prevBooks) => {
        const existingBook = prevBooks.find((prevBook) => prevBook.id === book.id);
        const normalizedBook = normalizeBook({ ...book, shelf: newShelf });

        if (existingBook) {
          return prevBooks.map((prevBook) =>
            prevBook.id === book.id ? { ...prevBook, shelf: newShelf } : prevBook
          );
        }

        return [...prevBooks, normalizedBook];
      });
    } catch (error) {
      console.error("Failed to update book shelf", error);
    }
  };

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
          onMoveBook={handleMoveBook}
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
                  onMoveBook={handleMoveBook}
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
