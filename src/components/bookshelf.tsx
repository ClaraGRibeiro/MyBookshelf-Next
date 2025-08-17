'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import TableBook from './tableBooks'
// components
import { Book } from '@/types/books'
import { useState } from 'react'
import { DrawingPinIcon, DrawingPinFilledIcon, RowsIcon, ViewGridIcon } from '@radix-ui/react-icons'
import { Handles } from '@/types/handles'
import GridBooks from './gridBooks'

type BookShelfProps = {
    books: Book[]
    handles: Handles
}

const Bookshelf = ({ books, handles }: BookShelfProps) => {
    const [sortBy, setSortBy] = useState<keyof Book | null>(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [pinReadings, setPinReadings] = useState(false)
    const [grid, setGrid] = useState(true)

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

    return (
        <main className='p-12 text-slate-800'>
            <div className='fixed bottom-8 right-3 flex flex-col gap-2 items-center justify-center'>
                <Button className='opacity-50 hover:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent' variant={'ghost'} onClick={() => setGrid(false)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <RowsIcon />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            View rows
                        </TooltipContent>
                    </Tooltip>
                </Button>
                <Button className='opacity-50 hover:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent' variant={'ghost'} onClick={() => setGrid(true)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <ViewGridIcon />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            View grid
                        </TooltipContent>
                    </Tooltip>
                </Button>
                <Button className='opacity-50 hover:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent' variant={'ghost'} onClick={() => setPinReadings((prev) => !prev)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                {pinReadings ? <DrawingPinFilledIcon className='!w-6 !h-6' /> : <DrawingPinIcon className='!w-6 !h-6' />}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Pin readings on the top
                        </TooltipContent>
                    </Tooltip>
                </Button>
            </div>
            <h1 className='text-center mb-12 text-3xl font-bold'>My BookShelf</h1>
            {grid ? <GridBooks books={books} handles={handles}/> : <TableBook books={books} handles={handles}/>}
        </main >
    )
}
export default Bookshelf