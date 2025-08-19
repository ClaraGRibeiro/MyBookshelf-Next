'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import TableBook from './tableBooks'
// components
import { Book } from '@/types/books'
import { useState } from 'react'
import { DrawingPinIcon, DrawingPinFilledIcon, ViewGridIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { Handles } from '@/types/handles'
import GridBooks from './gridBooks'

type BookShelfProps = {
    books: Book[]
    handles: Handles
}

const Bookshelf = ({ books, handles }: BookShelfProps) => {
    const [pinReadings, setPinReadings] = useState(false)
    const [grid, setGrid] = useState(true)
    const pagesRead = books.filter((b) => b.status === 'Read').reduce((acc, b) => acc + (b.pages || 0), 0)
    const totalPages = books.reduce((acc, b) => acc + (b.pages || 0), 0)
    const numBooksRead = books.filter((b) => b.status === 'Read').length
    const spent = books.reduce((acc, b) => acc + (b.price || 0), 0)
    const yearNow = new Date().getFullYear()
    const monthNow = new Date().getMonth() + 1
    const readingsY = books.filter((b) => b.readDate?.split('/')[2] === yearNow.toString()).length
    const readingsM = books.filter((b) => b.readDate?.split('/')[2] === yearNow.toString() && Number(b.readDate.split('/')[1]) === monthNow).length

    return (
        <main className='p-12 text-slate-800'>
            <div className='fixed bottom-8 right-3 flex flex-col gap-2 items-center justify-center'>
                <Button className='opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent' variant={'ghost'} onClick={() => setGrid((prev) => !prev)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                {!grid ? <ViewGridIcon className='!w-5 !h-5' /> : <ListBulletIcon className='!w-5 !h-5' />}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {!grid ? 'View grid' : 'View rows'}
                        </TooltipContent>
                    </Tooltip>
                </Button>
                <Button className='opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent' variant={'ghost'} onClick={() => setPinReadings((prev) => !prev)}>
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
            <h1 className='text-center text-3xl mb-12 font-bold'>My BookShelf</h1>
            {grid ? <GridBooks books={books} handles={handles} pinReadings={pinReadings} /> : <TableBook books={books} handles={handles} pinReadings={pinReadings} />}
            <p className='text-center text-xl mt-12'>
                {pagesRead} / {totalPages} pages ({(pagesRead * 100 / totalPages).toFixed(0)}%)
                ~ {numBooksRead} / {books.length} read books ({(numBooksRead * 100 / books.length).toFixed(0)}%)
                ~ {readingsY} this year ({readingsM} this month)
                ~ R$ {spent} (R$ {(spent / totalPages).toFixed(2)} per page)
            </p>
        </main >
    )
}
export default Bookshelf