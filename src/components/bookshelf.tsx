'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
// components
import { Book } from '@/types/books'
import DeleteAction from './actions/deleteaction'
import EditAction from './actions/editaction'
import SeeAction from './actions/seeaction'
import { useState } from 'react'
import { CaretSortIcon, DrawingPinIcon, DrawingPinFilledIcon } from '@radix-ui/react-icons'
import { Handles } from '@/types/handles'

type BookShelfProps = {
    books: Book[]
    handles: Handles
}

const Bookshelf = ({ books, handles }: BookShelfProps) => {
    const [sortBy, setSortBy] = useState<keyof Book | null>(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [pinReadings, setPinReadings] = useState(false)

    const handleSort = (key: keyof Book) => {
        if (sortBy === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortBy(key)
            setSortAsc(true)
        }
    }

    let sortedBooks: Book[] = []
    if (pinReadings) {
        sortedBooks = [
            ...[...books] // espalha livros e pega apenas os 'Reading' (em ordem)
                .filter((b) => b.status === 'Reading') // apenas 'Reading'
                .sort((a, b) => {
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
        ]
    }
        sortedBooks = [ // cria um array com os livros reorganizados juntando os elementos espalhados
            ...sortedBooks,
            ...[...books] // cria um array cópia dos livros (espalhando-os), faz os procedimentos e espalha seus elementos
                .filter((b) => pinReadings ? b.status !== 'Reading' : b.status) // sem ser 'Reading'
                .sort((a, b) => {
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
        ]

    const toggleStatus = (book: Book) => {
        let num: number = -1
        switch (book.status) {
            case "Unread": num = -1
                break;
            case "Reading": num = 0
                break;
            case "Read": num = 1
                break;
            default:
                break;
        }
        let newStatus: Book['status']
        num === 1 ? num = -1 : num++
        num === -1 ? newStatus = "Unread" : num === 0 ? newStatus = "Reading" : newStatus = "Read"
        handles.onChangeStatus(book.id, newStatus)
    }

    return (
        <main className='p-12 text-slate-800'>
            <Button className='fixed bottom-8 right-3 opacity-50 hover:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent' variant={'ghost'} onClick={() => setPinReadings((prev) => !prev)}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            {pinReadings ? <DrawingPinFilledIcon  className='!w-6 !h-6' /> : <DrawingPinIcon  className='!w-6 !h-6' />}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Pin readings on the top
                    </TooltipContent>
                </Tooltip>
            </Button>
            <h1 className='text-center mb-12 text-3xl font-bold'>My BookShelf</h1>
            <Table className='text-lg'>
                <TableCaption>{books.filter((b) => b.status === 'Read').length}/{books.length} books read</TableCaption>
                <TableHeader>
                    <TableRow className='text-base'>
                        <TableHead onClick={() => handleSort('title')} className='text-slate-600 cursor-pointer hover:text-slate-800 group sm:max-w-36'>
                            <span className='flex items-center flex-row gap-1'>
                                Book Title
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                        <TableHead onClick={() => handleSort('author')} className='text-slate-600 cursor-pointer hover:text-slate-800 group sm:max-w-36'>
                            <span className='flex items-center flex-row gap-1'>
                                Author
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                        <TableHead onClick={() => handleSort('publisher')} className='text-slate-600 cursor-pointer hover:text-slate-800 group sm:max-w-26'>
                            <span className='flex items-center flex-row gap-1'>
                                Publisher
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                        <TableHead onClick={() => handleSort('pages')} className='text-slate-600 cursor-pointer text-center hover:text-slate-800 group sm:max-w-24'>
                            <span className='flex items-center justify-center flex-row gap-1'>
                                Pages
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                        <TableHead onClick={() => handleSort('price')} className='text-slate-600 cursor-pointer text-center hover:text-slate-800 group sm:max-w-24'>
                            <span className='flex items-center justify-center flex-row gap-1'>
                                Price
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                        <TableHead onClick={() => handleSort('status')} className='text-slate-600 cursor-pointer text-center hover:text-slate-800 group w-24'>
                            <span className='flex items-center justify-center flex-row gap-1'>
                                Status
                                <CaretSortIcon className='inline group-hover:scale-130 duration-200' />
                            </span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedBooks.map((b) => (
                        <TableRow key={b.id} className={b.status === "Reading" ? 'bg-slate-200 hover:bg-slate-300' : ''}>
                            <TableCell className="whitespace-nowrap overflow-hidden truncate max-w-36">{b.title}</TableCell>
                            <TableCell className="whitespace-nowrap overflow-hidden truncate max-w-36">{b.author}</TableCell>
                            <TableCell className='whitespace-nowrap overflow-hidden truncate max-w-26'>{b.publisher ?? '-'}</TableCell>
                            <TableCell className='text-center w-24'>{b.pages ?? '-'}</TableCell>
                            <TableCell className={(b.price ?? 'text-green-500 font-bold') + ' text-center w-24'}>{b.price ? 'R$ ' + b.price.toFixed(2) : 'Free'}</TableCell>
                            <TableCell className='text-center max-w-24'>
                                <span
                                    onClick={() => toggleStatus(b)}
                                    className={
                                        (b.status == 'Read' ? 'bg-[#02A9F4] hover:bg-[#006AB3]' :
                                            b.status == 'Unread' ? 'bg-[#FF6666] hover:bg-[#E63431]' :
                                                'bg-[#f4d177] text-slate-800 hover:bg-[#FBAC0F] hover:text-slate-100')
                                        + ' text-sm text-slate-100 rounded-3xl px-2 py-1 cursor-pointer flex justify-center items-center gap-2 duration-200 select-none'
                                    }
                                >
                                    {b.status}
                                </span>
                            </TableCell>
                            <TableCell className='w-8'>
                                <SeeAction book={b} handles={handles} />
                            </TableCell>
                            <TableCell className='w-8'>
                                <EditAction book={b} onEdit={handles.onEdit} />
                            </TableCell>
                            <TableCell className='w-8'>
                                <DeleteAction book={b} onDelete={handles.onDelete} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main >
    )
}
export default Bookshelf