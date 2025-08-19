'use client'

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
// icons radix
import { OpenInNewWindowIcon } from '@radix-ui/react-icons'
// components
import { Book } from '@/types/books'

type LinkActionProps = {
    bookLink: Book['link']
}

const LinkAction = ({ bookLink }: LinkActionProps) => {
    return (
        <Button variant='ghost' className='p-2 cursor-pointer hover:bg-slate-800 active:bg-slate-800 group !duration-400'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <a 
                        href={bookLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className='text-slate-600 group-hover:text-slate-100 group-active:text-slate-100 flex items-center'
                    >
                        <OpenInNewWindowIcon className='!w-5 !h-5' />
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    Open purchase link
                </TooltipContent>
            </Tooltip>
        </Button>
    )
}

export default LinkAction