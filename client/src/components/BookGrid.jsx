import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";

const BookGrid = () => {
  const { books = [], loading, error } = useContext(BookContext) || {};

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">
        Error loading books: {error}
      </div>
    );
  if (!books || books.length === 0)
    return <div className="text-center p-4">No books available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {books.map((book, index) => (
        <div
          key={book._id || index}
          className="book-card bg-white p-4 rounded shadow"
        >
          <h3 className="font-bold">{book.title}</h3>
          <p>{book.author}</p>
          {book.price && <p>Price: ${book.price}</p>}
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
