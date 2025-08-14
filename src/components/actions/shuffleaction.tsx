'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// icons radix
import { ShuffleIcon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'
import { useState } from 'react'
import SeeAction from './seeaction'
import { Handles } from '@/types/handles'

type ShuffleActionProps = {
    books: Book[]
    handles: Handles
}

const ShuffleAction = ({ books, handles }: ShuffleActionProps) => {
    const [chosenBook, setChosenBook] = useState<Book | null>(null)
    const handleShuffleBook = () => {
        console.log("Start Shuffling books...")
        const unreadBooks = books.filter(b => b?.status === "Unread")
        console.log("Unread books separated")        
        if (unreadBooks.length === 0) {
            alert("No unread books available to shuffle.")
            return
        }
        console.log("Choosing a random book from unread books...")
        setChosenBook(unreadBooks[Math.floor(Math.random() * unreadBooks.length)])
        console.log("Random book chosen")
    }

    return (
        <>
            <Button variant='ghost' className='p-2 cursor-pointer hover:bg-slate-100 hover:text-slate-800 !duration-400' onClick={() => { handleShuffleBook() }}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <ShuffleIcon className='cursor-pointer !w-6 !h-6' />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Randomly choose the next book
                    </TooltipContent>
                </Tooltip>
            </Button>
            {chosenBook && (
                console.log(chosenBook.title),
                <SeeAction searchMode={true} book={chosenBook} handles={handles} />
            )}
        </>
    )
}

export default ShuffleAction