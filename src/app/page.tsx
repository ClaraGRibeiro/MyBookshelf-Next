"use client";

// components
import Bookshelf from "@/components/bookshelf";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import "./globals.css";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    import("../data/books.json")
      .then((data) => {
        setBooks(data.default);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // function containing all handler logic
  function allHandles(): Handles {
    // add a new book to the books array by spreading previous books and appending the new one
    const handleAdd = (book: Book): void => {
      setBooks((prev) => [...prev, book]);
    };

    // Edit an existing book by replacing the old book with the updated one in the same position
    const handleEdit = (book: Book): void => {
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
    };

    // Remove the deleted book by filtering it out from the books array
    const handleDelete = (bookId: Book["id"]): void => {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    };

    // Change the status of a book by copying its properties, updating the status, and replacing the old book
    const handleChangeStatus = (
      bookId: Book["id"],
      newStatus: Book["status"],
    ): void => {
      let newDate = undefined;
      if (newStatus === "Read") {
        const today = new Date();
        newDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
      }
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, status: newStatus, readDate: newDate } : b,
        ),
      );
    };

    // return all the handlers functions
    return {
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onChangeStatus: handleChangeStatus,
    };
  }

  const handles = allHandles();

  return (
    <>
      <div
        className={`bg-[var(--bg-sepia)] min-h-dvh relative ${
          loading ? "overflow-hidden h-dvh" : ""
        }`}
      >
        {loading && (
          <div className="h-dvh fixed w-full bg-[var(--dark-slate)] flex flex-col justify-center items-center gap-6 z-99">
            <div className="flex-wrap flex justify-center items-center gap-6">
              <img className="h-24" src="books.png" alt="Logo" />
              <h1 className="text-[var(--light-slate)] text-4xl font-bold">
                NextBook
              </h1>
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <span className="w-3 h-3 bg-[var(--light-blue)] rounded animate-bounce delay-0"></span>
                <span className="w-3 h-3 bg-[var(--light-red)] rounded animate-bounce delay-150"></span>
                <span className="w-3 h-3 bg-[var(--light-yellow)] rounded animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <Header books={books} handles={handles} />
        <Bookshelf books={books} handles={handles} />
        <Footer />
      </div>
    </>
  );
}
