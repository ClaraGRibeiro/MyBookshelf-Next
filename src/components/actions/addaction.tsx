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
    style?: string
}

const AddAction = ({ books, onAdd, style = '' }: AddActionProps) => {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' className={(`${style === 'grid' ? 'hover:bg-slate-800 active:bg-slate-800 hover:text-slate-100 active:text-slate-100 !px-2 !py-8' : 'hover:bg-slate-100 active:bg-slate-100 hover:text-slate-800 active:text-slate-800 !p-2'} ${style === 'dark' ? 'hover:bg-slate-800 active:bg-slate-800 hover:text-slate-100 active:text-slate-100' : ''}`) + ' cursor-pointer !duration-400'}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <PlusCircledIcon className={(style === 'grid' ? '!w-12 !h-12' : '!w-6 !h-6') + ' cursor-pointer'} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Add a book to the shelf
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
                        const maxId = books.reduce((max, book) => Math.max(max, book.id), 0)
                        const newBook: Book = {
                            id: maxId + 1,
                            title: data.get('title')?.toString() || '-',
                            author: data.get('author')?.toString() || '-',
                            publisher: data.get('publisher')?.toString() || '-',
                            pages: Number(data.get('pages')),
                            gotDate: data.get('gotDate')
                                ? data.get('gotDate')?.toString().split('-').reverse().join('/')
                                : '',
                            readDate: data.get('readDate')
                                ? data.get('readDate')?.toString().split('-').reverse().join('/')
                                : '',
                            price: Number(data.get('price')),
                            image: data.get('image')?.toString().trim() || '',
                            link: data.get('link')?.toString().trim() || '',
                            mode: (data.get('mode')?.toString() as Book['mode']) || 'Book',
                            status: (data.get('status')?.toString() as Book['status']) || data.get('readDate') && 'Read' || 'Unread',
                        }
                        
                        onAdd(newBook)
                        setOpen(false)
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Add a Book</DialogTitle>
                        <DialogDescription>
                            Add more book in your bookshelf. Click save when finished.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <Input type='text' name='title' placeholder='Book Title *' required />
                        <Input type='text' name='author' placeholder='Author Name *' required />
                        <Input type='text' name='publisher' placeholder='Publisher Name (optional)' />
                        <Input type='number' min={0} step={1} name='pages' placeholder='Pages (optional)' />
                        <div className='flex flex-row items-center justify-between'>
                            <span className='text-[#62748e] ml-3 text-sm'>Got Date (optional)</span>
                            <Input className='w-fit text-[#62748e]' type='date' name='gotDate' />
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span className='text-[#62748e] ml-3 text-sm'>Read Date (optional)</span>
                            <Input className='w-fit text-[#62748e]' type='date' name='readDate' />
                        </div>
                        <Input type='number' min={0} step={0.01} name='price' placeholder='Price (optional)' />
                        <Input type='text' name='image' placeholder='Image url (optional)' />
                        <Input type='text' name='link' placeholder='Purchase link (optional)' />
                        <Select name='mode'>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Mode' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Book'>Book</SelectItem>
                                <SelectItem value='PDF'>PDF</SelectItem>
                            </SelectContent>
                        </Select>
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