import BookList from "./BookList";

function BookShelf({ title, books, onMoveBook }) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <BookList books={books} onMoveBook={onMoveBook} />
      </div>
    </div>
  );
}

export default BookShelf;
