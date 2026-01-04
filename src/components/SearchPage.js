import BookList from "./BookList";

function SearchPage({
  query = "",
  results = [],
  onQueryChange,
  onClose,
  onMoveBook,
}) {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button type="button" className="close-search" onClick={onClose}>
          Close
        </button>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <BookList books={results} onMoveBook={onMoveBook} />
      </div>
    </div>
  );
}

export default SearchPage;
