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
  
  // função que reune todas as funções handles
  function allHandles(): Handles {
    
    // pega o que tinha antes no array livros, espalha e junta com o novo
    const handleAdd = (book: Book): void => { setBooks((prev) => [...prev, book]) }
    
    // caso o livro seja o editado, coloca ele no lugar do antigo
    const handleEdit = (book: Book): void => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? book : b
        )
      );
    }
    
    // pega tudo que não seja o livro excluído e seta como o array de livros atual
    const handleDelete = (bookId: Book['id']): void => { setBooks((prev) => prev.filter((b) => b.id !== bookId)) }
    
    // caso o livro seja o modificado, espalha seus atribudos, redefine o status e coloca ele no lugar do antigo
    const handleChangeStatus = (bookId: Book['id'], newStatus: Book['status']): void => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, status: newStatus } : b
        )
      );
    }
    
    // retorna todos os handles
    return ({
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onChangeStatus: handleChangeStatus,
    })
  }

  const handles = allHandles();

  return (
    <div className='bg-[#FFF8EF]'>
      <Header books={books} handles={handles} />
      <Bookshelf books={books} handles={handles} />
      <Footer />
    </div>
  );
}
