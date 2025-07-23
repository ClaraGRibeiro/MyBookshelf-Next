'use client'

// components shadcn
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
// components
import { Book } from '@/types/books'
import DeleteAction from './actions/deleteaction'
import EditAction from './actions/editaction'
import SeeAction from './actions/seeaction'
import { useState } from 'react'

type BookShelfProps = {
    books: Book[]
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

const Bookshelf = ({ books, setBooks }: BookShelfProps) => {
    const [sortBy, setSortBy] = useState<keyof Book | null>(null)
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key: keyof Book) => {
        if (sortBy === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortBy(key)
            setSortAsc(true)
        }
    }

    const sortedBooks = [...books].sort((a, b) => {
        if (!sortBy) return 0
        const aValue = a[sortBy] ?? ''
        const bValue = b[sortBy] ?? ''
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortAsc ? aValue - bValue : bValue - aValue
        }
        return sortAsc
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString())
    })

    return (
        <main className='p-12 text-slate-800'>
            <h1 className='text-center pb-6 text-xl font-bold'>My BookShelf</h1>
            <Table>
                <TableCaption>{books.filter((b) => b.status === 'Read').length}/{books.length} books read</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead onClick={() => handleSort('title')} className=' text-slate-600 cursor-pointer'>Book Title</TableHead>
                        <TableHead onClick={() => handleSort('author')} className=' text-slate-600 cursor-pointer'>Author Name</TableHead>
                        <TableHead onClick={() => handleSort('publisher')} className=' text-slate-600 cursor-pointer text-center'>Publisher Name</TableHead>
                        <TableHead onClick={() => handleSort('pages')} className=' text-slate-600 cursor-pointer text-center'>Pages</TableHead>
                        <TableHead onClick={() => handleSort('price')} className=' text-slate-600 cursor-pointer text-center'>Price</TableHead>
                        <TableHead onClick={() => handleSort('status')} className=' text-slate-600 cursor-pointer text-center'>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedBooks.map((b) => (
                        <TableRow key={b.id}>
                            <TableCell className="whitespace-nowrap overflow-hidden truncate max-w-32">{b.title}</TableCell>
                            <TableCell className="whitespace-nowrap overflow-hidden truncate max-w-32">{b.author}</TableCell>
                            <TableCell className='text-center'>{b.publisher ?? '-'}</TableCell>
                            <TableCell className='text-center'>{b.pages ?? '-'}</TableCell>
                            <TableCell className={(b.price ?? 'text-green-500 font-bold') + ' text-center'}>{b.price ? 'R$ ' + b.price.toFixed(2) : 'Free'}</TableCell>
                            <TableCell className='text-center'><span className={
                                (b.status == 'Read' ? 'bg-[#02A9F4]' : b.status == 'Unread' ? 'bg-[#FF6666]' : 'bg-[#FBAC0F]')
                                + ' text-slate-100 rounded-3xl px-2 py-1'
                            }>{b.status}</span></TableCell>
                            <TableCell className='w-6'>
                                <SeeAction book={b} setBooks={setBooks} />
                            </TableCell>
                            <TableCell className='w-6'>
                                <EditAction book={b} setBooks={setBooks} />
                            </TableCell>
                            <TableCell className='w-6'>
                                <DeleteAction book={b} setBooks={setBooks} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main >
    )
}
export default Bookshelf