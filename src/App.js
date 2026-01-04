import "./App.css";
import { useEffect, useRef, useState } from "react";
import BookShelf from "./components/BookShelf";
import SearchPage from "./components/SearchPage";
import { getAll, search as searchBooks, update } from "./BooksAPI";

const SHELF_TITLES = {
  currentlyReading: "Currently Reading",
  wantToRead: "Want to Read",
  read: "Read",
};

const normalizeBook = (book) => ({
  ...book,
  authors: (() => {
    const formattedAuthors = Array.isArray(book.authors)
      ? book.authors.join(", ")
      : book.authors;

    return formattedAuthors || "Unknown author";
  })(),
  cover: book.cover || book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail,
  dimensions: book.dimensions || { width: 128, height: 193 },
  shelf: book.shelf || "none",
});

function App() {
  const [books, setBooks] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const previousQueryRef = useRef("");

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

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      previousQueryRef.current = "";
      return;
    }

    if (previousQueryRef.current === trimmedQuery) {
      return;
    }

    previousQueryRef.current = trimmedQuery;

    let isActive = true;

    searchBooks(trimmedQuery, 20)
      .then((results) => {
        if (!isActive) return;

        if (!Array.isArray(results)) {
          setSearchResults([]);
          return;
        }

        const normalizedResults = results.map((result) => {
          const existingBook = books.find((book) => book.id === result.id);

          if (existingBook) {
            return normalizeBook({ ...result, shelf: existingBook.shelf });
          }

          return normalizeBook(result);
        });

        setSearchResults(normalizedResults);
      })
      .catch(() => {
        if (!isActive) return;

        setSearchResults([]);
      });

    return () => {
      isActive = false;
    };
  }, [books, query]);

  useEffect(() => {
    setSearchResults((prevResults) =>
      prevResults.map((result) => {
        const existingBook = books.find((book) => book.id === result.id);

        if (!existingBook) return result;

        return { ...result, shelf: existingBook.shelf };
      })
    );
  }, [books]);

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
          results={searchResults}
          onQueryChange={setQuery}
          onClose={() => {
            setShowSearchPage(false);
            setQuery("");
            setSearchResults([]);
          }}
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
