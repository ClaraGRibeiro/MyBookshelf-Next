'use client'

// components shadcn
import { Input } from './ui/input'
// icons radix
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
// components
import { useEffect, useState, useRef } from 'react'
import SeeAction from './actions/seeaction'
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'


type SearchProps = {
    books: Book[]
    handles: Handles
}

const Search = ({ books, handles }: SearchProps) => {
    const [search, setSearch] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)

    // pega só os livros que incluem as letras no título, autor ou editora e depois ordena alfabeticamente
    const foundBooks = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.publisher?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.title.localeCompare(b.title));

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book)
        setSearch('')
    }

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) { setSearchFocused(false) }
        }

        const handleScroll = () => { setSearchFocused(false) }

        document.addEventListener('click', handleClickOutside)
        window.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('click', handleClickOutside)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])


    return (
        <>
            <div className='relative flex items-center' ref={containerRef}>
                <MagnifyingGlassIcon className='absolute left-3' />
                {search.length > 0 && (
                    <Cross2Icon className='absolute right-3 z-1 cursor-pointer' onClick={() => {
                        setSearch('')
                        setSelectedBook(null)
                    }} />
                )}
                <Input className='px-10 relative w-full' placeholder='Search' type='text' value={search} onFocus={() => { setSearchFocused(true) }} onChange={(e) => {setSearch(e.target.value); setSearchFocused(true)}} />

                {search.length > 0 && searchFocused && ( // se digitou algo e se a barra de pesquisa está em foco
                    <div className='absolute w-full top-full w-screcth z-1 max-h-32 overflow-y-auto bg-slate-600 text-slate-100 text-sm'>
                        {foundBooks.length > 0 ? ( // se encontrou algum livro
                            foundBooks.map((b) => (
                                <p className='border border-b border-slate-800 hover:bg-slate-800 p-2 hover:cursor-pointer' key={b.id} onClick={() => handleSelectBook(b)}>{b.title}</p>
                            ))
                        ) : ( // se não encontrou nenhum livro
                            <p className='border border-b border-slate-800 hover:bg-slate-800 p-2 hover:cursor-not-allowed select-none'>Nenhum livro encontrado</p>
                        )}
                    </div>
                )}
            </div>

            {selectedBook && ( // se clicou em algum livro na pesquisa
                <SeeAction searchMode={true} book={selectedBook} handles={handles} />
            )}
        </>
    )
}

export default Search