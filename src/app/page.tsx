'use client'

// components
import Bookshelf from '@/components/bookshelf';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { books as initialBooks } from '@/data/books'
import { useState } from 'react';
import { Book } from '@/types/books';
import { Handles } from '@/types/handles';

export default function Home() {
  const [books, setBooks] = useState<Book[]>(initialBooks)

  // function containing all handler logic
  function allHandles(): Handles {
    
    // add a new book to the books array by spreading previous books and appending the new one
    const handleAdd = (book: Book): void => { setBooks((prev) => [...prev, book]) }
    
    // Edit an existing book by replacing the old book with the updated one in the same position
    const handleEdit = (book: Book): void => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? book : b
        )
      );
    }

    // Remove the deleted book by filtering it out from the books array
    const handleDelete = (bookId: Book['id']): void => { setBooks((prev) => prev.filter((b) => b.id !== bookId)) }

    // Change the status of a book by copying its properties, updating the status, and replacing the old book
    const handleChangeStatus = (bookId: Book['id'], newStatus: Book['status']): void => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, status: newStatus } : b
        )
      );
    }

    // return all the handlers functions
    return ({
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onChangeStatus: handleChangeStatus,
    })
  }

  const handles = allHandles();

  return (
    <div className='bg-[#FFF3E4]/80'>
      <Header books={books} handles={handles} />
      <Bookshelf books={books} handles={handles} />
      <Footer />
    </div>
  );
}
