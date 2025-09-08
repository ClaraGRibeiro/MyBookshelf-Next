"use client";

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
// icons radix
import { EyeOpenIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import DeleteAction from "./deleteAction";
import EditAction from "./editAction";
import { useState, useEffect } from "react";
import { Handles } from "@/types/handles";
import LinkAction from "./linkAction";

type SeeActionProps = {
  book: Book;
  handles: Handles;
  noButtonMode?: boolean;
};

const SeeAction = ({ book, handles, noButtonMode = false }: SeeActionProps) => {
  const [open, setOpen] = useState(noButtonMode);
  useEffect(() => {
    if (noButtonMode && book) setOpen(true);
  }, [noButtonMode, book]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!noButtonMode && (
        <DialogTrigger asChild>
          <Button variant="own">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="btn-content">
                  <EyeOpenIcon className="!w-5 !h-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>See '{book.title}'</TooltipContent>
            </Tooltip>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--medium-slate)] max-w-[90%] m-auto text-center">
            See '{book.title}'
          </DialogTitle>
          <DialogDescription className="text-[var(--dark-slate)]">
            More details about this book.
          </DialogDescription>
        </DialogHeader>
        <div className="relative grid gap-2">
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Book Title:</strong>{" "}
            {book.title}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Author Name:</strong>{" "}
            {book.author}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Publisher:</strong>{" "}
            {book.publisher ?? "-"}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Pages:</strong>{" "}
            {book.pages ?? "-"}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Got Date:</strong>{" "}
            {book.gotDate === undefined ? "-" : book.gotDate}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Read Date:</strong>{" "}
            {book.readDate === undefined ? "-" : book.readDate}
          </p>
          <p
            className={
              book.price > 0
                ? "text-[var(--dark-slate)]"
                : "text-[var(--green)]"
            }
          >
            <strong className="text-[var(--medium-slate)]">Price:</strong>{" "}
            {book.price > 0 ? "R$ " + book.price.toFixed(2) : "Free"}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Mode:</strong>{" "}
            {book.mode}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Ownership:</strong>{" "}
            {book.ownership}
          </p>
          <p className="text-[var(--dark-slate)]">
            <strong className="text-[var(--medium-slate)]">Status:</strong>{" "}
            <span
              className={
                (book.status == "Read"
                  ? "bg-[var(--dark-blue)]"
                  : book.status == "Unread"
                    ? "bg-[var(--dark-red)]"
                    : book.status == "Reading"
                      ? "bg-[var(--dark-yellow)]"
                      : "bg-[var(--medium-slate)]") +
                " text-sm text-[var(--light-slate)] rounded-3xl px-2 py-1 select-none"
              }
            >
              {book.status}
            </span>
          </p>
          {book.image && (
            <div className="aspect-[2/3] absolute h-52 m-auto right-0 bottom-0">
              <a
                href={book.link ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={book.link ? "cursor-pointer" : ""}
              >
                <img
                  src={book.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row w-full justify-end">
          {book.link && <LinkAction bookLink={book.link} />}
          <EditAction book={book} onEdit={handles.onEdit} />
          <DeleteAction
            book={book}
            onDelete={handles.onDelete}
            closeModal={() => setOpen(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAction;
