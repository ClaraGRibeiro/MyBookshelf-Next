"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { ScanBarcode } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import See from "./see";

type IsbnProps = {
  books: Book[];
  handles: Handles;
};

export function Isbn({ books, handles }: IsbnProps) {
  const [open, setOpen] = useState(false);
  const [bookFound, setBookFound] = useState<Book>();
  const formatString = (content: string | null) => {
    if (content === null || content === undefined) return "-";
    return content
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  useEffect(() => {
    setBookFound(undefined);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="own"
          className="hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)]"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] group-active:!text-[var(--dark-slate)] btn-content">
                <ScanBarcode
                  strokeWidth={1.5}
                  className={"md-icon cursor-pointer"}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>Search online by ISBN</TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-y-auto">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            const isbn = data.get("isbn")?.toString().trim();

            if (!isbn) return;

            try {
              const url = `https://brasilapi.com.br/api/isbn/v1/${isbn}`;
              const res = await fetch(url);
              const resData = await res.json();
              if (!res.ok) {
                toast("❌ ERROR", {
                  description: "Invalid ISBN!",
                });
                return;
              }
              const maxId = books.reduce(
                (max, book) => Math.max(max, book.id),
                0,
              );
              const today = new Date();

              const newBook: Book = {
                id: maxId + 1,
                title: formatString(resData.title ?? "-"),
                subtitle: formatString(resData.subtitle ?? "-"),
                author:
                  resData.authors?.length > 0
                    ? formatString(resData.authors.join("; "))
                    : "no author",
                publisher: formatString(resData.publisher ?? "-"),
                pages: Number(resData.page_count || 0),
                gotDate: `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`,
                readDate: undefined,
                price: 0,
                image: resData.cover_url || undefined,
                link: undefined,
                mode: "Physical",
                ownership: "Owned",
                status: "Unread",
              };
              setBookFound(newBook);
            } catch (err) {
              console.error(err);
              toast("❌ ERROR", {
                description: "Impossible to fetch ISBN!",
              });
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="max-w-[90%] m-auto text-center">
              Search
            </DialogTitle>
            <DialogDescription>
              Enter the ISBN of a book. Click "Save" to fetch its details
              online.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              name="isbn"
              placeholder="Insert the ISBN's Book *"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Search book
            </Button>
          </DialogFooter>
        </form>
        {bookFound && ( // if a book was clicked, open the modal
          <See
            noButtonMode={true}
            addMode={true}
            book={bookFound}
            handles={{
              ...handles,
              onAdd: (newBook) => {
                handles.onAdd(newBook);
                setBookFound(undefined);
              },
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
