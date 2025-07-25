'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
// icons radix
import { EyeOpenIcon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'
import DeleteAction from './deleteaction'
import EditAction from './editaction'
import { useState, useEffect } from 'react'
import { Handles } from '@/types/handles'

type SeeActionProps = {
    book: Book
    handles: Handles
    searchMode?: boolean
}

const SeeAction = ({ book, handles, searchMode = false }: SeeActionProps) => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (searchMode && book) { setOpen(true) }
    }, [book])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!searchMode && (
                <DialogTrigger asChild>
                    <Button variant='ghost' className='p-2 cursor-pointer hover:bg-slate-800 group !duration-400'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className='text-slate-600 group-hover:text-slate-100'>
                                    <EyeOpenIcon className='!w-5 !h-5' />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                See '{book.title}'
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='text-slate-600'>See '{book.title}'</DialogTitle>
                    <DialogDescription className='text-slate-800'>
                        More details about this book.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-2'>
                    <p className='text-slate-800'><strong className='text-slate-600'>Book Title:</strong> {book.title}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Author Name:</strong> {book.author}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Publisher:</strong> {book.publisher ?? '-'}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Pages:</strong> {book.pages ?? '-'}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Got Date:</strong> {book.gotDate ?? '-'}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Read Date:</strong> {book.readDate ?? '-'}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Price:</strong> {book.price ?? 'Free'}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Mode:</strong> {book.mode}</p>
                    <p className='text-slate-800'><strong className='text-slate-600'>Status:</strong> {book.status}</p>
                </div>
                <DialogFooter>
                    <EditAction book={book} onEdit={handles.onEdit} />
                    <DeleteAction book={book} onDelete={handles.onDelete} closeModal={() => setOpen(false)} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SeeAction