'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// icons radix
import { PlusCircledIcon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'
import { useState } from 'react'
import { Handles } from '@/types/handles'

type AddActionProps = {
    books: Book[]
    onAdd: Handles['onAdd']
}

const AddAction = ({ books, onAdd }: AddActionProps) => {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' className='p-2 cursor-pointer hover:bg-slate-100 hover:text-slate-800 !duration-400'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <PlusCircledIcon className='cursor-pointer !w-6 !h-6' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Add a book to the shelf
                        </TooltipContent>
                    </Tooltip>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.currentTarget
                        const data = new FormData(form)
                        const maxId = books.reduce((max, book) => Math.max(max, book.id), 0)
                        const newBook: Book = {
                            id: maxId + 1,
                            title: data.get('title')?.toString() || '-',
                            author: data.get('author')?.toString() || '-',
                            publisher: data.get('publisher')?.toString() || '-',
                            pages: Number(data.get('pages')),
                            gotDate: data.get('gotDate')?.toString(),
                            readDate: data.get('readDate')?.toString(),
                            price: Number(data.get('price')),
                            mode: (data.get('mode')?.toString() as Book['mode']) || 'Book',
                            status: (data.get('status')?.toString() as Book['status']) || 'Unread',
                        }
                        onAdd(newBook)
                        setOpen(false)
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Add a Book</DialogTitle>
                        <DialogDescription>
                            Add more book in your bookshelf. Click save&apos;when you re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid gap-3'>
                            <Input type='text' name='title' placeholder='Book Title' required />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='author' placeholder='Author Name' required />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='publisher' placeholder='Publisher Name' />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='number' min={0} step={1} name='pages' placeholder='Pages' />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='gotDate' placeholder='Got Date' />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='readDate' placeholder='Read Date' />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='number' min={0} step={0.01} name='price' placeholder='Price' />
                        </div>
                        <div className='grid gap-3'>
                            <Select name='mode'>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Mode' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Book'>Book</SelectItem>
                                    <SelectItem value='PDF'>PDF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-3'>
                            <Select name='status'>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Unread'>Unread</SelectItem>
                                    <SelectItem value='Read'>Read</SelectItem>
                                    <SelectItem value='Reading'>Reading</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline' className='cursor-pointer'>Cancel</Button>
                        </DialogClose>
                        <Button type='submit' className='cursor-pointer'>Add book</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddAction