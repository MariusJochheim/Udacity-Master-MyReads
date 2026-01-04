import Book from "./Book";

function BookList({ books = [], onMoveBook }) {
  return (
    <ol className="books-grid">
      {books.map((book) => (
        <li key={book.id || book.title}>
          <Book
            title={book.title}
            authors={book.authors}
            cover={book.cover}
            width={book.dimensions?.width}
            height={book.dimensions?.height}
            shelf={book.shelf}
            onMove={(shelf) => onMoveBook?.(book, shelf)}
          />
        </li>
      ))}
    </ol>
  );
}

export default BookList;
