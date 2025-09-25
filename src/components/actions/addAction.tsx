"use client";

// components shadcn
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  const [ownership, setOwnership] = useState<Book["ownership"]>("Owned");
  const [mode, setMode] = useState<Book["mode"]>("Physical");
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    if (open) {
      setImagePreview("");
      setOwnership("Owned");
      setMode("Physical");
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="own"
          className={`
            ${large ? " w-full h-full object-cover " : ""}
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
      <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-y-auto">
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
            const titleVar = data.get("title")?.toString()
            const authorVar = data.get("author")?.toString()
            const newBook: Book = {
              id: maxId + 1,
              title: titleVar ? titleVar.charAt(0).toUpperCase() + titleVar.slice(1).toLowerCase() : "No Title",
              author: authorVar ? authorVar.charAt(0).toUpperCase() + authorVar.slice(1).toLowerCase() : "No Author",
              publisher: data.get("publisher")?.toString() || undefined,
              pages: Number(data.get("pages")),
              gotDate: data.get("gotDate")
                ? data.get("gotDate")?.toString().split("-").reverse().join("/")
                : undefined,
              readDate: data.get("readDate")
                ? data
                    .get("readDate")
                    ?.toString()
                    .split("-")
                    .reverse()
                    .join("/")
                : undefined,
              price: Number(data.get("price")),
              image: data.get("image")?.toString().trim() || undefined,
              link: data.get("link")?.toString().trim() || undefined,
              mode: mode,
              ownership: ownership,
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
            <DialogTitle className="max-w-[90%] m-auto text-center">
              Add a Book
            </DialogTitle>
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
              <span className="text-[var(--dark-slate)] ml-3 text-sm">
                Got Date (optional)
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
                type="date"
                name="gotDate"
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-[var(--dark-slate)] ml-3 text-sm">
                Read Date (optional)
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
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
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex flex-col gap-2">
                <span className="text-[var(--dark-slate)]">Mode</span>
                <RadioGroup
                  value={mode}
                  onValueChange={(val) => setMode(val as Book["mode"])}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Physical" id="Physical" />
                    <Label htmlFor="Physical">Physical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Digital" id="Digital" />
                    <Label htmlFor="Digital">Digital</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[var(--dark-slate)]">Ownership</span>
                <RadioGroup
                  value={ownership}
                  onValueChange={(val) =>
                    setOwnership(val as Book["ownership"])
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Owned" id="Owned" />
                    <Label htmlFor="Owned">Owned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Borrowed" id="Borrowed" />
                    <Label htmlFor="Borrowed">Borrowed</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Select name="status">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unread">Unread</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Next">Next</SelectItem>
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
