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
    const [pinReadings, setPinReadings] = useState(false)
    const [grid, setGrid] = useState(true)

    return (
        <main className='p-12 text-slate-800'>
            <div className='fixed bottom-8 right-3 flex flex-col gap-2 items-center justify-center'>
                <Button className='opacity-50 hover:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent' variant={'ghost'} onClick={() => setGrid((prev) => !prev)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                {!grid ? <ViewGridIcon className='!w-5 !h-5' /> : <RowsIcon className='!w-5 !h-5' />}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {!grid ? 'View grid' : 'View rows'}
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
            {grid ? <GridBooks books={books} handles={handles} pinReadings={pinReadings} /> : <TableBook books={books} handles={handles} pinReadings={pinReadings} />}
        </main >
    )
}
export default Bookshelf