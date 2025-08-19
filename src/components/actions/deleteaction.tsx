'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
// icons radix
import { TrashIcon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'
import { Handles } from '@/types/handles'

type DeleteActionProps = {
    book: Book
    onDelete: Handles['onDelete']
    closeModal?: () => void
}

const DeleteAction = ({ book, onDelete, closeModal }: DeleteActionProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' className='p-2 cursor-pointer hover:bg-[#E63431] active:bg-[#E63431] group !duration-400'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-[#FF6666] group-hover:text-slate-100 group-active:text-slate-100'>
                                <TrashIcon className='!w-5 !h-5' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Delete '{book.title}'
                        </TooltipContent>
                    </Tooltip>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='text-slate-600'>Detele '{book.title}'</DialogTitle>
                    <DialogDescription className='text-slate-800'>
                        Click delete to remove permanently this book.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline' className='cursor-pointer text-slate-800'>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant='destructive' className='cursor-pointer text-slate-100 bg-[#FF6666] !duration-400 hover:bg-[#E63431] active:bg-[#E63431]' onClick={() => {
                            onDelete(book.id)
                            closeModal && closeModal()
                        }}>Delete</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAction