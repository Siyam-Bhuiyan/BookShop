import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const BookContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://your-production-url.com"
    : "http://localhost:5000",
});

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/books");
        setBooks(response.data.books || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <BookContext.Provider value={{ books, loading, error }}>
      {children}
    </BookContext.Provider>
  );
};
