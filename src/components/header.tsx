'use client'

// components
import Search from './search'
import AddAction from './actions/addaction'
import ShuffleAction from './actions/shuffleaction'
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'

type HeaderProps = {
    books: Book[]
    handles: Handles
}

const Header = ({ books, handles }: HeaderProps) => {
    return (
        <header className='h-fill flex-wrap bg-slate-800 flex md:justify-between justify-center items-center py-3 px-12 gap-3'>
            <a className='flex items-center gap-2' href='/'>
                <img className='md:h-12 h-8' src='books.png' alt='Logo' />
                <h1 className='text-slate-100 text-2xl md:text-xl font-bold'>NextBook</h1>
            </a>
            <div className='flex gap-x-6 gap-y-2 items-center flex-wrap-reverse justify-center text-slate-100'>
                <ul className='flex gap-6 items-center'>
                    <li>
                        <ShuffleAction books={books} handles={handles} />
                    </li>
                    <li>
                        <AddAction books={books} onAdd={handles.onAdd} />
                    </li>
                </ul>
                <Search books={books} handles={handles} />
            </div>
        </header>
    )
}

export default Header