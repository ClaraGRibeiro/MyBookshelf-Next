'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from './ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
// icons radix
import { CaretSortIcon, ChevronDownIcon } from '@radix-ui/react-icons'
// components
import { useState } from 'react'
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'
import DeleteAction from './actions/deleteaction'
import EditAction from './actions/editaction'
import SeeAction from './actions/seeaction'
import AddAction from './actions/addaction'

type TableBooksProps = {
    books: Book[]
    handles: Handles
    pinReadings: Boolean
}

const TableBook = ({ books, handles, pinReadings }: TableBooksProps) => {
    const [filterBy, setFilterBy] = useState<Book['status'] | null>(null)
    const [sortBy, setSortBy] = useState<keyof Book>('title')
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key: keyof Book) => {
        if (sortBy === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortBy(key)
            setSortAsc(true)
        }
    }

    const compareBooks = (a: Book, b: Book) => {
        if (!sortBy) return 0
        const aValue = a[sortBy] ?? ''
        const bValue = b[sortBy] ?? ''

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortAsc ? aValue - bValue : bValue - aValue
        }

        return sortAsc
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString())
    }

    let sortedBooks: Book[]
    if (pinReadings) {
        const readings = books.filter(b => b.status === 'Reading').sort(compareBooks)
        const others = books.filter(b => b.status !== 'Reading').sort(compareBooks)
        sortedBooks = [...readings, ...others]
    } else {
        sortedBooks = [...books].sort(compareBooks)
    }
    if (filterBy) { sortedBooks = sortedBooks.filter((b) => b.status === filterBy) }

    const toggleStatus = (book: Book) => {
        let num: number = -1
        switch (book.status) {
            case 'Unread': num = -1
                break;
            case 'Reading': num = 0
                break;
            case 'Read': num = 1
                break;
            default:
                break;
        }
        let newStatus: Book['status']
        num === 1 ? num = -1 : num++
        num === -1 ? newStatus = 'Unread' : num === 0 ? newStatus = 'Reading' : newStatus = 'Read'
        handles.onChangeStatus(book.id, newStatus)
    }

    return (
        <Table className='text-lg'>
            <TableCaption><AddAction books={books} onAdd={handles.onAdd} style='dark' /></TableCaption>
            <TableHeader>
                <TableRow className='text-base'>
                    <TableHead onClick={() => handleSort('title')} className='text-slate-600 cursor-pointer hover:text-slate-800 active:text-slate-800 group sm:max-w-36'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit'>
                                    Book Title
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Book Title
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead onClick={() => handleSort('author')} className='text-slate-600 cursor-pointer hover:text-slate-800 active:text-slate-800 group sm:max-w-36 hidden md:table-cell'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit'>
                                    Author
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Author
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead onClick={() => handleSort('publisher')} className='text-slate-600 cursor-pointer hover:text-slate-800 active:text-slate-800 group sm:max-w-26 hidden md:table-cell'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit'>
                                    Publisher
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Publisher
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead onClick={() => handleSort('pages')} className='text-slate-600 cursor-pointer hover:text-slate-800 active:text-slate-800 group sm:max-w-24 hidden md:table-cell'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit mx-auto'>
                                    Pages
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Pages
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead onClick={() => handleSort('price')} className='text-slate-600 cursor-pointer hover:text-slate-800 active:text-slate-800 group sm:max-w-24 hidden md:table-cell'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit mx-auto'>
                                    Price
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Price
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className='text-slate-600 cursor-pointer text-center hover:text-slate-800 active:text-slate-800 group w-24 hidden md:table-cell'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='flex items-center flex-row gap-1 w-fit mx-auto'>
                                    Status
                                    <CaretSortIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                Sort by Status
                            </TooltipContent>
                        </Tooltip>
                    </TableHead>
                    <TableHead colSpan={3}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='m-auto cursor-pointer group text-slate-600 hover:text-slate-800 active:text-slate-800 hover:border-slate-800 active:border-slate-800 group flex-row gap-2 border border-slate-600 rounded px-2 py-1 flex justify-between items-center'>
                                <span>Filter by</span>
                                <ChevronDownIcon className='inline group-hover:scale-130 group-active:scale-130 duration-200' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setFilterBy("Unread")}>Unread</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setFilterBy("Reading")}>Reading</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setFilterBy("Read")}>Read</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setFilterBy(null)}>All</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedBooks.map((b) => (
                    <TableRow key={b.id} className={b.status === 'Reading' ? 'bg-slate-200 hover:bg-slate-300 active:bg-slate-300' : ''}>
                        <TableCell className='whitespace-nowrap overflow-hidden truncate max-w-36'>{b.title}</TableCell>
                        <TableCell className='hidden md:table-cell whitespace-nowrap overflow-hidden truncate max-w-36'>{b.author}</TableCell>
                        <TableCell className='hidden md:table-cell whitespace-nowrap overflow-hidden truncate max-w-26'>{b.publisher ?? '-'}</TableCell>
                        <TableCell className='hidden md:table-cell text-center w-24'>{b.pages ?? '-'}</TableCell>
                        <TableCell className={(b.price ?? 'text-green-600 font-bold') + ' hidden md:table-cell text-center w-24'}>{b.price ? 'R$ ' + b.price.toFixed(2) : 'Free'}</TableCell>
                        <TableCell className='hidden md:table-cell text-center max-w-24'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span
                                        onClick={() => toggleStatus(b)}
                                        className={
                                            (b.status == 'Read' ? 'bg-[#02A9F4] hover:bg-[#006AB3] active:bg-[#006AB3]' :
                                                b.status == 'Unread' ? 'bg-[#FF6666] hover:bg-[#E63431] active:bg-[#E63431]' :
                                                    'bg-[#f4d177] text-slate-800 hover:bg-[#FBAC0F] active:bg-[#FBAC0F] hover:text-slate-100 active:text-slate-100')
                                            + ' text-sm text-slate-100 rounded-3xl px-2 py-1 cursor-pointer flex justify-center items-center gap-2 duration-200 select-none'
                                        }
                                    >
                                        {b.status}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded text-center'>
                                    Change status
                                </TooltipContent>
                            </Tooltip>
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
        </Table >
    )
}

export default TableBook