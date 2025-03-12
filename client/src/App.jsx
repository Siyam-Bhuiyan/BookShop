import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import { BookProvider } from "./context/BookContext";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <BookProvider>
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-[calc(100vh-100px)] mt-16">
            <Outlet />
          </main>
          <Footer />
        </ErrorBoundary>
      </BookProvider>
    </>
  );
}

export default App;
