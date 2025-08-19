'use client'

// components shadcn
// components
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'
import { useEffect, useState } from 'react'
import SeeAction from './actions/seeaction'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'

type GridBooksProps = {
    books: Book[]
    handles: Handles
    pinReadings: Boolean
}

const GridBooks = ({ books, handles, pinReadings }: GridBooksProps) => {
    let sortedBooks: Book[] = []
    if (pinReadings) {
        sortedBooks = [
            ...[...books] // espalha livros e pega apenas os 'Reading' (em ordem)
                .filter((b) => b.status === 'Reading'), // apenas 'Reading')
            ...[...books].filter((b) => b.status !== 'Reading')
        ]
    } else sortedBooks = books
    const [clickedBookId, setClickedBookId] = useState<number | null>(null)

    const handleClicked = (bId: number) => {
        if (bId === clickedBookId) {
            setClickedBookId(null)
            setTimeout(() => setClickedBookId(bId), 0)
        } else setClickedBookId(bId)
    }
    const clickedBook = books.find(b => b.id === clickedBookId) || null
    
    return (
        <>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center'>
                {sortedBooks.map((b) => (
                    <div key={b.id} className={(b.status === 'Reading' && 'shadow-[0_0_10px_#f4d177,0_0_15px_#f4d177,0_0_35px_#f4d177]') + ' aspect-[2/3] relative hover:scale-110 duration-200 cursor-pointer group'} onClick={() => handleClicked(b.id)}>
                        <img className='w-full h-full object-cover' src={b.image || 'nobookcover.png'} alt={b.title} title={b.status + ' ~ ' + b.title} />
                        <BookmarkFilledIcon className={
                            (b.status == 'Read' ? 'text-[#02A9F4]' :
                                b.status == 'Unread' ? 'text-[#FF6666]' :
                                    'text-[#FBAC0F]') + ' absolute top-0 right-0 p-0 m-0 duration-200 h-8 w-8 group-hover:opacity-100'} />
                        {!b.image && <span className='absolute transform top-1/3 -translate-y-1/3 right-1/2 translate-x-105/200 text-center line-clamp-2 w-[80%] max-h-[90%] select-none text-xl font-bold text-white'>{b.title}</span>}
                    </div>
                ))}
                {clickedBook && <SeeAction noButtonMode={true} book={clickedBook} handles={handles} />}
            </div>
        </>
    )
}

export default GridBooks