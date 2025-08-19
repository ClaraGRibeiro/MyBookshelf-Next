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
                <Button variant='ghost' className='p-2 cursor-pointer hover:bg-slate-800 group !duration-400'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-slate-600 group-hover:text-slate-100'>
                                <Pencil2Icon className='!w-5 !h-5' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit '{book.title}'
                        </TooltipContent>
                    </Tooltip>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] max-h-[98%] overflow-y-auto'>
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
                            gotDate: data.get('gotDate')?.toString().split('-').reverse().join('/') || book.gotDate,
                            readDate: data.get('readDate')?.toString().split('-').reverse().join('/') || book.readDate,
                            price: Number(data.get('price')) || book.price,
                            image: data.has('image') ? data.get('image')?.toString() : book.image,
                            link: data.has('link') ? data.get('link')?.toString() : book.link,
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
                        <Input type='text' name='title' placeholder='Book Title *' defaultValue={book.title} />
                        <Input type='text' name='author' placeholder='Author Name *' defaultValue={book.author} />
                        <Input type='text' name='publisher' placeholder='Publisher Name (optional)' defaultValue={book.publisher} />
                        <Input type='number' min={0} step={1} name='pages' placeholder='Pages (optional)' defaultValue={book.pages} />
                        <div className='flex flex-row items-center justify-between'>
                            <span className='text-[#62748e] ml-3 text-sm'>Got Date (optional)</span>
                            <Input className='w-fit text-[#62748e]' type='date' defaultValue={book.gotDate?.split('/').reverse().join('-')} name='gotDate' />
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span className='text-[#62748e] ml-3 text-sm'>Read Date (optional)</span>
                            <Input className='w-fit text-[#62748e]' type='date' defaultValue={book.readDate?.split('/').reverse().join('-')} name='readDate' />
                        </div>
                        <Input type='number' min={0} step={0.01} name='price' placeholder='Price (optional)' defaultValue={book.price} />
                        <Input type='text' name='image' placeholder='Image url (optional)' defaultValue={book.image} />
                        <Input type='text' name='link' placeholder='Purchase link (optional)' defaultValue={book.link} />
                        <Select name='mode' value={mode} onValueChange={(value) => setMode(value as Book['mode'])}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Mode' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Book'>Book</SelectItem>
                                <SelectItem value='PDF'>PDF</SelectItem>
                            </SelectContent>
                        </Select>
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline' className='cursor-pointer'>Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type='submit' className='cursor-pointer !bg-slate-600 text-slate-100 hover:!bg-slate-800'>Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditAction