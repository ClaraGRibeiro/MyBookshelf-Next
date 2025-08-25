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
import { PlusCircledIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { useEffect, useState } from "react";
import { Handles } from "@/types/handles";

type AddActionProps = {
  books: Book[];
  onAdd: Handles["onAdd"];
  large?: boolean;
  lightBg?: boolean;
};

const AddAction = ({
  books,
  onAdd,
  large = false,
  lightBg = false,
}: AddActionProps) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    if (open) {
      setImagePreview("");
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="own"
          className={`
            ${large ? " !px-2 !py-8 " : ""}
                ${!lightBg ? " hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)] " : ""}
                `}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`${!lightBg ? " !text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] !group-active:text-[var(--dark-slate)] " : ""} + ' btn-content '`}
              >
                <PlusCircledIcon
                  className={large ? "!w-12 !h-12" : "!w-6 !h-6"}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>Add a book to the shelf</TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[98%] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const maxId = books.reduce(
              (max, book) => Math.max(max, book.id),
              0,
            );
            let readDateVar: string | undefined =
              data.get("readDate")?.toString().split("-").reverse().join("/") ||
              "";
            let statusVar = data.get("status")?.toString() || "";
            if (readDateVar && statusVar !== "Read") {
              alert("Please set the book as read!");
              return;
            }
            if (statusVar === "Read" && !readDateVar) {
              alert("Please insert a read date!");
              return;
            }
            const newBook: Book = {
              id: maxId + 1,
              title: data.get("title")?.toString() || "-",
              author: data.get("author")?.toString() || "-",
              publisher: data.get("publisher")?.toString() || "-",
              pages: Number(data.get("pages")),
              gotDate: data.get("gotDate")
                ? data.get("gotDate")?.toString().split("-").reverse().join("/")
                : "",
              readDate: data.get("readDate")
                ? data
                    .get("readDate")
                    ?.toString()
                    .split("-")
                    .reverse()
                    .join("/")
                : "",
              price: Number(data.get("price")),
              image: data.get("image")?.toString().trim() || "",
              link: data.get("link")?.toString().trim() || "",
              mode: (data.get("mode")?.toString() as Book["mode"]) || "Book",
              status:
                (data.get("status")?.toString() as Book["status"]) ||
                (data.get("readDate") && "Read") ||
                "Unread",
            };

            onAdd(newBook);
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a Book</DialogTitle>
            <DialogDescription>
              Add more book in your bookshelf. Click save when finished.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              name="title"
              placeholder="Book Title *"
              required
            />
            <Input
              type="text"
              name="author"
              placeholder="Author Name *"
              required
            />
            <Input
              type="text"
              name="publisher"
              placeholder="Publisher Name (optional)"
            />
            <Input
              type="number"
              min={0}
              step={1}
              name="pages"
              placeholder="Pages (optional)"
            />
            <div className="flex flex-row items-center justify-between">
              <span className="text-[#62748e] ml-3 text-sm">
                Got Date (optional)
              </span>
              <Input
                className="w-fit text-[#62748e]"
                type="date"
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
                name="readDate"
              />
            </div>
            <Input
              type="number"
              min={0}
              step={0.01}
              name="price"
              placeholder="Price (optional)"
            />
            <div className="flex flex-justify-between items-center gap-4 text-sm">
              {imagePreview && (
                <div className={"aspect-[2/3] w-12 relative"}>
                  <img
                    className="w-full h-full object-cover"
                    src={imagePreview}
                    alt="preview"
                  />
                </div>
              )}
              <Input
                onChange={(e) => setImagePreview(e.target.value)}
                type="text"
                name="image"
                placeholder="Image url (optional)"
              />
            </div>
            <Input
              type="text"
              name="link"
              placeholder="Purchase link (optional)"
            />
            <Select name="mode">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Book">Book</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Select name="status">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
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
            <Button type="submit" className="cursor-pointer">
              Add book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAction;
