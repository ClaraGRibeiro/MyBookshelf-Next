'use client'

// components
import Search from './search'
import AddAction from './actions/addaction'
import { Book } from '@/types/books'

type HeaderProps = {
    books: Book[]
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

const Header = ({ books, setBooks }: HeaderProps) => {
    return (
        <header className='h-fill flex-wrap bg-slate-800 flex md:justify-between justify-center items-center py-3 px-12 gap-3'>
            <a className='flex items-center gap-2' href='/'>
                <img className='md:h-12 h-6' src='books.png' alt='Logo' />
                <h1 className='text-slate-100 text-xl font-bold'>NextBook</h1>
            </a>
            <div>
                <ul className='flex gap-6 items-center text-slate-100'>
                    <li>
                        <AddAction books={books} setBooks={setBooks}/>
                    </li>
                    <li>
                        <Search books={books} setBooks={setBooks}/>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default Header