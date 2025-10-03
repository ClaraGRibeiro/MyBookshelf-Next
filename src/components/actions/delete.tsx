"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type DeleteProps = {
  book: Book;
  onDelete: Handles["onDelete"];
  closeModal?: () => void;
};

export default function Delete({ book, onDelete, closeModal }: DeleteProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="own"
          className="bg-transparent hover:bg-[var(--dark-red)] active:bg-[var(--dark-red)]"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[var(--dark-red)] group-hover:text-[var(--light-slate)] group-active:text-[var(--light-slate)]">
                <TrashIcon className="!w-5 !h-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Delete '{book.title}'</TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[var(--medium-slate)]">
            Detele '{book.title}'
          </DialogTitle>
          <DialogDescription className="text-[var(--dark-slate)]">
            Click delete to remove permanently this book.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer text-[var(--dark-slate)]"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="own"
              className="cursor-pointer !text-[var(--light-slate)] bg-[var(--light-red)] !duration-400 hover:bg-[var(--dark-red)] active:bg-[var(--dark-red)]"
              onClick={() => {
                onDelete(book.id);
                closeModal && closeModal();
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
