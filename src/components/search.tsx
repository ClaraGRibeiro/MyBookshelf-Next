'use client'

// components shadcn
import { Input } from './ui/input'
// icons radix
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
// components
import { useState } from 'react'
import SeeAction from './actions/seeaction'
import { Book } from '@/types/books'

type SearchProps = {
    books: Book[]
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

const Search = ({ books, setBooks }: SearchProps) => {
    const [search, setSearch] = useState('')
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)

    const foundBooks = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.publisher?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.title.localeCompare(b.title));

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book)
        setSearch('')
    }

    return (
        <>
            <div className='relative flex items-center'>
                <MagnifyingGlassIcon className='absolute left-3' />
                <Input className='pl-10 relative w-full' placeholder='Search' type='text' value={search} onChange={(e) => setSearch(e.target.value)} />

                {search.length > 0 && (
                    <div className='absolute w-full top-full w-screcth z-1 max-h-24 overflow-y-auto bg-slate-600 text-slate-100 text-sm'>
                        {foundBooks.length > 0 ? (
                            foundBooks.map((b) => (
                                <p className='border border-b border-slate-800 hover:bg-slate-800 p-2 hover:cursor-pointer' key={b.id} onClick={() => handleSelectBook(b)}>{b.title}</p>
                            ))
                        ) : (
                            <p className='border border-b border-slate-800 hover:bg-slate-800 p-2 hover:cursor-not-allowed'>Nenhum livro encontrado</p>
                        )}
                    </div>
                )}
            </div>

            {selectedBook && (
                <SeeAction searchMode={true} book={selectedBook} setBooks={setBooks} />
            )}
        </>
    )
}

export default Search