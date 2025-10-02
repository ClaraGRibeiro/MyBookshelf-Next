"use client";

// components
import Bookshelf from "@/components/bookshelf";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dev = process.env.NODE_ENV === "development";

  useEffect(() => {
    import("../data/books.json")
      .then((data) => {
        setBooks(data.default);
      })
      .catch(console.error);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // function containing all handler logic
  function allHandles(): Handles {
    // add a new book to the books array by spreading previous books and appending the new one
    const handleAdd = async (book: Book): Promise<void> => {
      setBooks((prev) => [...prev, book]);
      if (dev) {
        await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book),
        });
      }
    };

    // Edit an existing book by replacing the old book with the updated one in the same position
    const handleEdit = async (book: Book): Promise<void> => {
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
      if (dev) {
        await fetch("/api/books", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book),
        });
      }
    };

    // Remove the deleted book by filtering it out from the books array
    const handleDelete = async (bookId: Book["id"]): Promise<void> => {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      if (dev) {
        await fetch(`/api/books?id=${bookId}`, {
          method: "DELETE",
        });
      }
    };

    // Change the status of a book by copying its properties, updating the status, and replacing the old book
    const handleChangeStatus = async (
      bookId: Book["id"],
      newStatus: Book["status"],
    ): Promise<void> => {
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
      if (dev) {
        const updatedBook = books.find((b) => b.id === bookId);
        if (updatedBook) {
          const bookToSave = {
            ...updatedBook,
            status: newStatus,
            readDate: newDate,
          };
          await fetch("/api/books", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookToSave),
          });
        }
      }
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
