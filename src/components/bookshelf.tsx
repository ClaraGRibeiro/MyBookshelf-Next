'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
// components próprios
import TableBook from './tableBooks'
import GridBooks from './gridBooks'
import Charts from './charts'
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'
import { useState } from 'react'
import { DrawingPinIcon, DrawingPinFilledIcon, ViewGridIcon, ListBulletIcon } from '@radix-ui/react-icons'

type BookShelfProps = {
  books: Book[]
  handles: Handles
}

const Bookshelf = ({ books, handles }: BookShelfProps) => {
  const [pinReadings, setPinReadings] = useState(false)
  const [grid, setGrid] = useState(true)

  const totalSpent = books.reduce((acc, b) => acc + (b.price || 0), 0)
  const numBooksRead = books.filter((b) => b.status === 'Read').length
  const yearNow = new Date().getFullYear()
  const monthNow = new Date().getMonth() + 1
  const readingsY = books.filter((b) => b.readDate?.split('/')[2] === yearNow.toString()).length
  const readingsM = books.filter((b) => b.readDate?.split('/')[2] === yearNow.toString() && Number(b.readDate.split('/')[1]) === monthNow).length
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const booksByMonth = months.map((m, i) => { return { name: m, value: books.filter((b) => b.readDate?.split('/')[2] === yearNow.toString() && Number(b.readDate.split('/')[1]) === i + 1).length } })
  const years = Array.from(new Set(books.filter(b => b.readDate).map((b) => Number(b.readDate?.split('/')[2])))).sort((x, y) => x - y)
  const booksByYear = years.map((y, i) => { return { name: y.toString(), value: books.filter((b) => Number(b.readDate?.split('/')[2]) === y).length } })

  return (
    <main className='p-12 text-slate-800'>
      <div className='fixed bottom-8 right-3 flex flex-col gap-2 items-center justify-center'>
        <Button
          className='opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent'
          variant='ghost'
          onClick={() => setGrid((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {!grid ? (
                  <ViewGridIcon className='!w-5 !h-5' />
                ) : (
                  <ListBulletIcon className='!w-5 !h-5' />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded'>
              {!grid ? 'View grid' : 'View rows'}
            </TooltipContent>
          </Tooltip>
        </Button>

        <Button
          className='opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent'
          variant='ghost'
          onClick={() => setPinReadings((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {pinReadings ? (
                  <DrawingPinFilledIcon className='!w-6 !h-6' />
                ) : (
                  <DrawingPinIcon className='!w-6 !h-6' />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className='bg-gray-800 text-slate-100 p-2 rounded'>
              Pin readings on the top
            </TooltipContent>
          </Tooltip>
        </Button>
      </div>

      <h1 className='text-center text-3xl mb-12 font-bold'>My BookShelf</h1>

      {grid ? (
        <GridBooks books={books} handles={handles} pinReadings={pinReadings} />
      ) : (
        <TableBook books={books} handles={handles} pinReadings={pinReadings} />
      )}
      <div className='mt-12 md:mt-16 flex flex-col gap-6 items-center justify-center'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 justify-items-center items-center mb-2'>
          <p className='text-center font-bold text-3xl'><span className='bg-gradient-to-r from-[#006AB3] via-[#E63431] to-[#FBAC0F] bg-clip-text text-transparent'>R$ <br /> {totalSpent} <br /> total</span></p>
          <Charts type='pie' value={numBooksRead} total={books.length} label='Readings' colors={['#006AB3', '#cad5e2']} />
          <Charts type='pie' value={readingsY} total={numBooksRead} label={'In ' + yearNow} colors={['#E63431', '#cad5e2']} />
          <Charts type='pie' value={readingsM} total={readingsY} label={'In ' + new Date().toLocaleString('en-US', { month: 'long' })} colors={['#FBAC0F', '#cad5e2']} />
        </div>
        <Charts type='bar' data={booksByYear} label='Books per Year' colors={['#E63431']} />
        <Charts type='bar' data={booksByMonth} label='Books per Month (2025)' colors={['#FBAC0F']} />
      </div>
    </main>
  )
}

export default Bookshelf
