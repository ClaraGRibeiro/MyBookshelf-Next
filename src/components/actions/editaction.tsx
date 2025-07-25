'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// icons radix
import { Pencil2Icon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'
import { useState } from 'react'
import { Handles } from '@/types/handles'

type EditActionProps = {
    book: Book
    onEdit: Handles['onEdit']
}

const EditAction = ({ book, onEdit }: EditActionProps) => {

    const [mode, setMode] = useState(book.mode)
    const [status, setStatus] = useState(book.status)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' className='p-2 cursor-pointer'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-slate-600'>
                                <Pencil2Icon className='cursor-pointer' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit '{book.title}'
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
                        const updatedBook: Book = {
                            ...book,
                            title: data.get('title')?.toString() || book.title,
                            author: data.get('author')?.toString() || book.author,
                            publisher: data.get('publisher')?.toString() || book.publisher,
                            pages: Number(data.get('pages')) || book.pages,
                            gotDate: data.get('gotDate')?.toString() || book.gotDate,
                            readDate: data.get('readDate')?.toString() || book.readDate,
                            price: Number(data.get('price')) || book.price,
                            mode: (data.get('mode')?.toString() as Book['mode']) || book.mode,
                            status: (data.get('status')?.toString() as Book['status']) || book.status,
                        }
                        onEdit(updatedBook)
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className='text-slate-600'>Edit '{book.title}'</DialogTitle>
                        <DialogDescription className='text-slate-800'>
                            Make changes to this book here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4 text-slate-600'>
                        <div className='grid gap-3'>
                            <Input type='text' name='title' placeholder='Book Title' defaultValue={book.title} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='author' placeholder='Author Name' defaultValue={book.author} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='publisher' placeholder='Publisher Name' defaultValue={book.publisher} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='number' min={0} step={1} name='pages' placeholder='Pages' defaultValue={book.pages} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='gotDate' placeholder='Got Date' defaultValue={book.gotDate} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='text' name='readDate' placeholder='Read Date' defaultValue={book.readDate} />
                        </div>
                        <div className='grid gap-3'>
                            <Input type='number' min={0} step={0.01} name='price' placeholder='Price' defaultValue={book.price} />
                        </div>
                        <div className='grid gap-3'>
                            <Select name='mode' value={mode} onValueChange={(value) => setMode(value as Book['mode'])}>
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
                            <Select name='status' value={status} onValueChange={(value) => setStatus(value as Book['status'])}>
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
                        <DialogClose asChild>
                            <Button type='submit' className='cursor-pointer !bg-slate-600 text-slate-100'>Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditAction