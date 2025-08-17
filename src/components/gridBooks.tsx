'use client'

// components shadcn
// components
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'
import { useState } from 'react'
import SeeAction from './actions/seeaction'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'

type GridBooksProps = {
    books: Book[]
    handles: Handles
}

const GridBooks = ({ books, handles }: GridBooksProps) => {
    const [clickedBook, setClickedBook] = useState<Book | null>(null)
    return (
        <>
            <div className='grid grid-cols-3 md:grid-cols-6 gap-8 justify-items-center'>
                {books.map((b) => (
                    <div key={b.id} className='relative hover:scale-110 duration-200 cursor-pointer group' onClick={() => setClickedBook(b)}>
                        <img className='max-h-48' src={b.image || 'https://cdn.creazilla.com/cliparts/3164704/book-clipart-md.png'} alt={b.title} title={b.status + " ~ " + b.title} />
                        <BookmarkFilledIcon className={
                            (b.status == 'Read' ? 'text-[#02A9F4]' :
                                b.status == 'Unread' ? 'text-[#FF6666]' :
                                    'text-[#FBAC0F]') + ' absolute top-0 right-0 p-0 m-0 opacity-40 duration-200 h-8 w-8 group-hover:opacity-100'} />
                        {!b.image && <span className='absolute transform top-1/2 -translate-y-1/2 overflow-hidden text-center p-6 break-words w-[90%] max-h-[90%]'>{b.title}</span>}
                    </div>
                ))}
                {clickedBook && <SeeAction searchMode={true} book={clickedBook} handles={handles} />}
            </div>
        </>
    )
}

export default GridBooks