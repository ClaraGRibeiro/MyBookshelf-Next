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
import { Pencil2Icon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { useEffect, useState } from "react";
import { Handles } from "@/types/handles";

type EditActionProps = {
  book: Book;
  onEdit: Handles["onEdit"];
};

const EditAction = ({ book, onEdit }: EditActionProps) => {
  const [mode, setMode] = useState(book.mode);
  const [status, setStatus] = useState(book.status);
  const [readDate, setReadDate] = useState(book.readDate);
  const [ownership, setOwnership] = useState(book.ownership);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(book.image || "");
  useEffect(() => {
    if (open) {
      setImagePreview(book.image || "");
    }
  }, [open, book.image]);

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
            const statusVar = data.get("status")?.toString();
            if (readDate && statusVar !== "Read") {
              alert("There is reading date. Please mark the book as read!");
              return;
            }
            if (statusVar === "Read" && !readDate) {
              alert("The book is marked as read. Please enter a reading date!");
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
              readDate: readDate === "" ? undefined : readDate,
              price: Number(data.get("price")) || book.price,
              image: imagePreview || book.image,
              link: data.has("link") ? data.get("link")?.toString() : book.link,
              mode: mode,
              ownership: ownership,
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
              defaultValue={book.publisher ?? undefined}
            />
            <Input
              type="number"
              min={0}
              step={1}
              name="pages"
              placeholder="Pages (optional)"
              defaultValue={book.pages ?? undefined}
            />
            <div className="flex flex-row items-center justify-between">
              <span className="text-[var(--medium-slate)] ml-3 text-sm">
                Got Date (optional)
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
                type="date"
                defaultValue={book.gotDate?.split("/").reverse().join("-")}
                name="gotDate"
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="text-[var(--medium-slate)] ml-3 text-sm">
                Read Date (optional)
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
                type="date"
                value={readDate ? readDate.split("/").reverse().join("-") : ""}
                onChange={(e) =>
                  setReadDate(
                    e.target.value
                      .split("-")
                      .reverse()
                      .join("/") as Book["readDate"],
                  )
                }
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
            <div className="flex flex-justify-between items-center gap-4">
              {imagePreview && (
                <div className={"aspect-[2/3] w-12 relative"}>
                  <img
                    className="w-full h-full object-cover"
                    src={imagePreview}
                    alt="Image Preview"
                  />
                </div>
              )}
              <Input
                onChange={(e) => setImagePreview(e.target.value)}
                type="text"
                name="image"
                placeholder="Image url (optional)"
                defaultValue={book.image ?? undefined}
              />
            </div>
            <Input
              type="text"
              name="link"
              placeholder="Purchase link (optional)"
              defaultValue={book.link ?? undefined}
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
            <Select
              name="status"
              value={status}
              onValueChange={(val) => setStatus(val as Book["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent defaultValue={book.status}>
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
