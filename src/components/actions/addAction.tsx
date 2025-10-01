"use client";

// components shadcn
import { Switch } from "@/components/ui/switch";
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
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { PlusCircledIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AddActionProps = {
  books: Book[];
  onAdd: Handles["onAdd"];
  onDelete: Handles["onDelete"];
  large?: boolean;
  lightBg?: boolean;
};

const AddAction = ({
  books,
  onAdd,
  onDelete,
  large = false,
  lightBg = false,
}: AddActionProps) => {
  const [isbnMode, setIsbnMode] = useState<boolean>(false);
  const [ownership, setOwnership] = useState<Book["ownership"]>("Owned");
  const [mode, setMode] = useState<Book["mode"]>("Physical");
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const formatString = (content: unknown) => {
    if (content == null || typeof content !== "string") return null;
    return content
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        <DialogHeader>
          <DialogTitle className="max-w-[90%] m-auto text-center">
            Add a Book
          </DialogTitle>
          <DialogDescription>
            Add more book in your bookshelf. Click save when finished.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center items-baseline gap-4">
          <span>data</span>
          <Switch onClick={() => setIsbnMode(!isbnMode)} checked={isbnMode} />
          <span>isbn</span>
        </div>
        {isbnMode && (
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
                    description: "Invalid ISBN",
                  });
                  return;
                }
                const maxId = books.reduce(
                  (max, book) => Math.max(max, book.id),
                  0,
                );
                const today = new Date();
                const titleVar = formatString(resData.title) || "No Title";

                const newBook: Book = {
                  id: maxId + 1,
                  title: titleVar,
                  subtitle: formatString(resData.subtitle),
                  author:
                    formatString(
                      Array.isArray(resData.authors) &&
                        resData.authors.length > 0 &&
                        resData.authors.join("; "),
                    ) || "No Author",
                  publisher: formatString(resData.publisher),
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
                onAdd(newBook);
                toast("✅ Success", {
                  description:
                    "Book [" +
                    (titleVar?.length > 25
                      ? titleVar?.slice(0, 20) + "..."
                      : titleVar) +
                    "] has been created",
                  action: {
                    label: "Undo",
                    onClick: () => onDelete(newBook.id),
                  },
                });
              } catch (err) {
                console.error(err);
                toast("❌ ERROR", {
                  description: "Error fetching ISBN",
                });
              }
            }}
          >
            <div className="grid gap-4 py-4">
              <Input
                type="text"
                name="isbn"
                placeholder="Book ISBN *"
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
                Add book
              </Button>
            </DialogFooter>
          </form>
        )}
        {!isbnMode && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const statusVar = data.get("status")?.toString();
              const readDateVar = data.get("readDate")
                ? data
                    .get("readDate")
                    ?.toString()
                    .split("-")
                    .reverse()
                    .join("/")
                : undefined;
              const today = new Date();
              const gotDateVar = data.get("gotDate")
                ? data.get("gotDate")?.toString().split("-").reverse().join("/")
                : `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
              if (readDateVar && statusVar !== "Read") {
                toast("❌ ERROR", {
                  description: "Please set the book as read!",
                });
                return;
              }
              if (statusVar === "Read" && !readDateVar) {
                toast("❌ ERROR", {
                  description: "Please insert a read date!",
                });
                return;
              }

              const titleVar = formatString(data.get("title")!.toString());
              const subtitleVar = data.get("subtitle")
                ? formatString(data.get("subtitle")!.toString())
                : undefined;
              const authorVar = formatString(data.get("author")!.toString());
              const publisherVar = data.get("publisher")
                ? formatString(data.get("publisher")!.toString())
                : undefined;
              const maxId = books.reduce(
                (max, book) => Math.max(max, book.id),
                0,
              );
              const newBook: Book = {
                id: maxId + 1,
                title: titleVar || "no title",
                subtitle: subtitleVar,
                author: authorVar || "no author",
                publisher: publisherVar,
                pages: Number(data.get("pages")),
                gotDate: gotDateVar,
                readDate: readDateVar,
                price: Number(data.get("price")),
                image: data.get("image")?.toString().trim() || undefined,
                link: data.get("link")?.toString().trim() || undefined,
                mode: mode,
                ownership: ownership,
                status:
                  (data.get("status")?.toString() as Book["status"]) ||
                  (readDateVar && "Read") ||
                  "Unread",
              };
              onAdd(newBook);
              toast("✅ Book has been created", {
                description: titleVar,
                action: {
                  label: "Undo",
                  onClick: () => onDelete(newBook.id),
                },
              });

              setOpen(false);
            }}
          >
            <div className="grid gap-4 py-4">
              <Input
                type="text"
                name="title"
                placeholder="Book Title *"
                required
              />
              <Input
                type="text"
                name="subtitle"
                placeholder="Subtitle (optional)"
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
                  <span className="text-[var(--medium-slate)] ml-3 text-sm">
                    Mode
                  </span>
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
                  <span className="text-[var(--medium-slate)] ml-3 text-sm">
                    Ownership
                  </span>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddAction;
