const SELECT_OPTIONS = [
  { value: "move", label: "Move to...", disabled: true },
  { value: "currentlyReading", label: "Currently Reading" },
  { value: "wantToRead", label: "Want to Read" },
  { value: "read", label: "Read" },
  { value: "none", label: "None" },
];

function Book({
  title,
  authors,
  cover,
  width = 128,
  height = 193,
  shelf = "none",
  onMove,
}) {
  const handleMove = (event) => {
    onMove?.(event.target.value);
  };

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width,
            height,
            backgroundImage: cover ? `url("${cover}")` : "none",
          }}
        ></div>
        <div className="book-shelf-changer">
          <select value={shelf} onChange={handleMove}>
            {SELECT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors}</div>
    </div>
  );
}

export default Book;
