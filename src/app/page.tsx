'use client'

// components
import Bookshelf from '@/components/bookshelf';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { books as initialBooks } from '@/data/books'
import { useState } from 'react';
import { Book } from '@/types/books';

export default function Home() {

  const [books, setBooks] = useState<Book[]>(initialBooks)

  return (
    <div className='bg-[#FFF8EF]'>
      <Header books={books} setBooks={setBooks} />
      <Bookshelf books={books} setBooks={setBooks} />
      <Footer />
    </div>
  );
}
