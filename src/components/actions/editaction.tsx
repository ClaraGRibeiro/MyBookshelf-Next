"use client";

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// icons radix
import { Pencil2Icon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { useState } from "react";
import { Handles } from "@/types/handles";

type EditActionProps = {
  book: Book;
  onEdit: Handles["onEdit"];
};

const EditAction = ({ book, onEdit }: EditActionProps) => {
  const [mode, setMode] = useState(book.mode);
  const [status, setStatus] = useState(book.status);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="own">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="btn-content">
                <Pencil2Icon className="!w-5 !h-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Edit '{book.title}'</TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[98%] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            let readDateVar: string | undefined =
              data.get("readDate")?.toString().split("-").reverse().join("/") ||
              book.readDate;
            let statusVar = data.get("status")?.toString() || book.status;
            if (readDateVar && statusVar !== "Read") {
              alert("Please set the book as read!");
              return;
            }
            if (statusVar === "Read" && !readDateVar) {
              alert("Please insert a read date!");
              return;
            }
            const updatedBook: Book = {
              ...book,
              title: data.get("title")?.toString() || book.title,
              author: data.get("author")?.toString() || book.author,
              publisher: data.get("publisher")?.toString() || book.publisher,
              pages: Number(data.get("pages")) || book.pages,
              gotDate:
                data
                  .get("gotDate")
                  ?.toString()
                  .split("-")
                  .reverse()
                  .join("/") || book.gotDate,
              readDate: readDateVar,
              price: Number(data.get("price")) || book.price,
              image: data.has("image")
                ? data.get("image")?.toString()
                : book.image,
              link: data.has("link") ? data.get("link")?.toString() : book.link,
              mode: (data.get("mode")?.toString() as Book["mode"]) || book.mode,
              status: statusVar as Book["status"],
            };
            onEdit(updatedBook);
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-[var(--medium-slate)]">
              Edit '{book.title}'
            </DialogTitle>
            <DialogDescription className="text-[var(--dark-slate)]">
              Make changes to this book here. Click save when finished.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-[var(--medium-slate)]">
            <Input
              type="text"
              name="title"
              placeholder="Book Title *"
              defaultValue={book.title}
            />
            <Input
              type="text"
              name="author"
              placeholder="Author Name *"
              defaultValue={book.author}
            />
            <Input
              type="text"
              name="publisher"
              placeholder="Publisher Name (optional)"
              defaultValue={book.publisher}
            />
            <Input
              type="number"
              min={0}
              step={1}
              name="pages"
              placeholder="Pages (optional)"
              defaultValue={book.pages}
            />
            <div className="flex flex-row items-center justify-between">
              <span className="text-[#62748e] ml-3 text-sm">
                Got Date (optional)
              </span>
              <Input
                className="w-fit text-[#62748e]"
                type="date"
                defaultValue={book.gotDate?.split("/").reverse().join("-")}
                name="gotDate"
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-[#62748e] ml-3 text-sm">
                Read Date (optional)
              </span>
              <Input
                className="w-fit text-[#62748e]"
                type="date"
                defaultValue={book.readDate?.split("/").reverse().join("-")}
                name="readDate"
              />
            </div>
            <Input
              type="number"
              min={0}
              step={0.01}
              name="price"
              placeholder="Price (optional)"
              defaultValue={book.price}
            />
            <Input
              type="text"
              name="image"
              placeholder="Image url (optional)"
              defaultValue={book.image}
            />
            <Input
              type="text"
              name="link"
              placeholder="Purchase link (optional)"
              defaultValue={book.link}
            />
            <Select
              name="mode"
              value={mode}
              onValueChange={(value) => setMode(value as Book["mode"])}
              defaultValue={book.mode}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Book">Book</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="status"
              value={status}
              onValueChange={(value) => setStatus(value as Book["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent defaultValue={book.status}>
                <SelectItem value="Unread">Unread</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer !bg-[var(--medium-slate)] text-[var(--light-slate)] hover:!bg-[var(--dark-slate)] active:!bg-[var(--dark-slate)]"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAction;
