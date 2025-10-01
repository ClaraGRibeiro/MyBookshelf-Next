"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// icons
import { PlusCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
// types
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { Switch } from "@/components/ui/switch";

type BookFormProps = {
  isEdit?: boolean;
  book?: Book;
  onAdd?: Handles["onAdd"];
  onEdit?: Handles["onEdit"];
  large?: boolean;
  lightBg?: boolean;
};

export default function BookForm({
  isEdit = false,
  book,
  onAdd,
  onEdit,
  large = false,
  lightBg = false,
}: BookFormProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Book["mode"]>(book?.mode || "Physical");
  const [status, setStatus] = useState<Book["status"]>(
    book?.status || "Unread",
  );
  const [ownership, setOwnership] = useState<Book["ownership"]>(
    book?.ownership || "Owned",
  );
  const [readDate, setReadDate] = useState<Book["readDate"]>(book?.readDate);
  const [imagePreview, setImagePreview] = useState(book?.image || "");

  useEffect(() => {
    if (open && isEdit) {
      setMode(book?.mode || "Physical");
      setOwnership(book?.ownership || "Owned");
      setStatus(book?.status || "Unread");
      setReadDate(book?.readDate);
      setImagePreview(book?.image || "");
    }
  }, [open, isEdit, book]);

  const formatString = (content: unknown) => {
    if (content == null || typeof content !== "string") return null;
    return content
      .trim()
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const statusVar = data.get("status")?.toString();
    const readDateVar = data.get("readDate")
      ? data.get("readDate")?.toString().split("-").reverse().join("/")
      : undefined;

    if (readDateVar && statusVar !== "Read") {
      toast("❌ ERROR", { description: "Please set the book as read!" });
      return;
    }
    if (statusVar === "Read" && !readDateVar) {
      toast("❌ ERROR", { description: "Please insert a read date!" });
      return;
    }

    const titleVar = formatString(data.get("title")!.toString());
    const subtitleVar =
      data.get("subtitle")?.toString().trim() === ""
        ? undefined
        : formatString(data.get("subtitle"));
    const authorVar = formatString(data.get("author")!.toString());
    const publisherVar = data.get("publisher")
      ? formatString(data.get("publisher")!.toString())
      : undefined;

    if (isEdit && book && onEdit) {
      // UPDATE
      const updatedBook: Book = {
        ...book,
        title: titleVar || book.title,
        subtitle: subtitleVar,
        author: authorVar || book.author,
        publisher: publisherVar || book.publisher,
        pages: Number(data.get("pages")) || book.pages,
        gotDate:
          data.get("gotDate")?.toString().split("-").reverse().join("/") ||
          book.gotDate,
        readDate: readDateVar,
        price: Number(data.get("price")) || book.price,
        image: imagePreview || book.image,
        link: data.has("link") ? data.get("link")?.toString() : book.link,
        mode,
        ownership,
        status: statusVar as Book["status"],
      };
      onEdit(updatedBook);
      setOpen(false);
    } else if (!isEdit && onAdd) {
      // CREATE
      const today = new Date();
      const gotDateVar =
        data.get("gotDate")?.toString().split("-").reverse().join("/") ||
        `${String(today.getDate()).padStart(2, "0")}/${String(
          today.getMonth() + 1,
        ).padStart(2, "0")}/${today.getFullYear()}`;

      const newBook: Book = {
        id: 0,
        title: titleVar!,
        subtitle: subtitleVar,
        author: authorVar!,
        publisher: publisherVar,
        pages: Number(data.get("pages")),
        gotDate: gotDateVar,
        readDate: readDateVar,
        price: Number(data.get("price")),
        image: data.get("image")?.toString().trim() || undefined,
        link: data.get("link")?.toString().trim() || undefined,
        mode,
        ownership,
        status: (statusVar as Book["status"]) || "Unread",
      };

      onAdd(newBook);
      toast("✅ Book has been created", { description: titleVar });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="own"
          className={` ${large && !isEdit ? " w-full h-full object-cover " : ""} ${!lightBg && !isEdit ? " hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)] " : ""} `}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              {isEdit ? (
                <span
                  className={`${!lightBg && !isEdit ? " !text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] !group-active:text-[var(--dark-slate)] " : ""} + ' btn-content '`}
                >
                  <Pencil2Icon
                    className={
                      large && !isEdit
                        ? "!w-12 !h-12"
                        : !large && !isEdit
                          ? "!w-6 !h-6"
                          : "!w-5 !h-5"
                    }
                  />
                </span>
              ) : (
                <span
                  className={`
            ${!lightBg ? "!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] !group-active:text-[var(--dark-slate)]" : ""}
            btn-content
          `}
                >
                  <PlusCircledIcon
                    className={large ? "!w-12 !h-12" : "!w-6 !h-6"}
                  />
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {isEdit ? `Edit '${book?.title}'` : "Add a new book"}
            </TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEdit ? `Edit '${book?.title}'` : "Add a Book"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Make changes to this book. Click save when finished."
                : "Add a new book to your shelf. Click save when finished."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              name="title"
              placeholder="Book Title *"
              defaultValue={isEdit ? book?.title : ""}
              required
            />
            <Input
              type="text"
              name="subtitle"
              placeholder="Subtitle (optional)"
              defaultValue={isEdit ? (book?.subtitle ?? "") : ""}
            />
            <Input
              type="text"
              name="author"
              placeholder="Author Name *"
              defaultValue={isEdit ? book?.author : ""}
              required
            />
            <Input
              type="text"
              name="publisher"
              placeholder="Publisher Name (optional)"
              defaultValue={isEdit ? (book?.publisher ?? "") : ""}
            />
            <Input
              type="number"
              name="pages"
              min={0}
              step={1}
              placeholder="Pages (optional)"
              defaultValue={isEdit ? (book?.pages ?? "") : ""}
            />

            {/* datas */}
            <div className="flex justify-between">
              <span className="text-[var(--dark-slate)] ml-3 text-sm">
                Got Date
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
                type="date"
                name="gotDate"
                defaultValue={
                  isEdit && book?.gotDate
                    ? book.gotDate.split("/").reverse().join("-")
                    : ""
                }
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dark-slate)] ml-3 text-sm">
                Read Date
              </span>
              <Input
                className="w-fit text-[var(--medium-slate)]"
                type="date"
                name="readDate"
                value={
                  readDate ? readDate.split("/").reverse().join("-") : undefined
                }
                onChange={(e) =>
                  setReadDate(
                    e.target.value
                      .split("-")
                      .reverse()
                      .join("/") as Book["readDate"],
                  )
                }
              />
            </div>

            <Input
              type="number"
              name="price"
              min={0}
              step={0.01}
              placeholder="Price (optional)"
              defaultValue={isEdit ? (book?.price ?? "") : ""}
            />

            {/* image preview */}
            <div className="flex items-center gap-3">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-12 h-16 object-cover"
                />
              )}
              <Input
                type="text"
                name="image"
                placeholder="Image url (optional)"
                defaultValue={isEdit ? (book?.image ?? "") : ""}
                onChange={(e) => setImagePreview(e.target.value)}
              />
            </div>

            <Input
              type="text"
              name="link"
              placeholder="Purchase link (optional)"
              defaultValue={isEdit ? (book?.link ?? "") : ""}
            />

            {/* mode & ownership */}
            <div className="flex justify-between">
              <div>
                <span className="text-[var(--dark-slate)] ml-3 text-sm">
                  Mode
                </span>
                <RadioGroup
                  className="mt-1"
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

              <div>
                <span className="text-[var(--dark-slate)] ml-3 text-sm">
                  Ownership
                </span>
                <RadioGroup
                  className="mt-1"
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

            {/* status */}
            <Select
              name="status"
              value={status}
              onValueChange={(val) => setStatus(val as Book["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isEdit ? "Save changes" : "Add book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
