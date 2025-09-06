"use client";

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
// components
import { useEffect, useState } from "react";
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import DeleteAction from "./actions/deleteaction";
import EditAction from "./actions/editaction";
import SeeAction from "./actions/seeaction";
import AddAction from "./actions/addaction";
import FilterBy from "./actions/filterBy";
import SortBy from "./actions/sortBy";

type TableBooksProps = {
  books: Book[];
  handles: Handles;
  pinReadings: Boolean;
};

const TableBook = ({ books, handles, pinReadings }: TableBooksProps) => {
  const [filterBy, setFilterBy] = useState<
    Book["status"] | Book["ownership"] | Book["mode"] | null
  >(null);
  const [sortBy, setSortBy] = useState<keyof Book>("title");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: keyof Book) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const compareBooks = (a: Book, b: Book) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy] ?? "";
    const bValue = b[sortBy] ?? "";

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }

    return sortAsc
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  };

  let sortedBooks: Book[];
  if (pinReadings) {
    sortedBooks = [
      ...books.filter((b) => b.status === "Reading").sort(compareBooks),
      ...books.filter((b) => b.status === "Next").sort(compareBooks),
      ...books
        .filter((b) => b.status !== "Reading" && b.status !== "Next")
        .sort(compareBooks),
    ];
  } else {
    sortedBooks = [...books.sort(compareBooks)];
  }
  if (filterBy) {
    if (filterBy === "Owned" || filterBy === "Borrowed") {
      sortedBooks = sortedBooks.filter((b) => b.ownership === filterBy);
    } else if (filterBy === "Physical" || filterBy === "Digital") {
      sortedBooks = sortedBooks.filter((b) => b.mode === filterBy);
    } else if (filterBy === "Unread") {
      sortedBooks = sortedBooks.filter((b) => b.status !== "Read");
    } else {
      sortedBooks = sortedBooks.filter((b) => b.status === filterBy);
    }
  }

  const toggleStatus = (book: Book) => {
    let num: number = -2;
    switch (book.status) {
      case "Unread":
        num = -2;
        break;
      case "Next":
        num = -1;
        break;
      case "Reading":
        num = 0;
        break;
      case "Read":
        num = 1;
        break;
      default:
        break;
    }
    let newStatus: Book["status"];
    num === 1 ? (num = -2) : num++;
    num === -2
      ? (newStatus = "Unread")
      : num === -1
        ? (newStatus = "Next")
        : num === 0
          ? (newStatus = "Reading")
          : (newStatus = "Read");
    handles.onChangeStatus(book.id, newStatus);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [clickedBookId, setClickedBookId] = useState<number | null>(null);
  const handleClicked = (bId: number) => {
    if (bId === clickedBookId) {
      setClickedBookId(null);
      setTimeout(() => setClickedBookId(bId), 0);
    } else setClickedBookId(bId);
  };
  const clickedBook = books.find((b) => b.id === clickedBookId) || null;

  return (
    <Table className="text-lg">
      <TableCaption>
        <AddAction books={books} onAdd={handles.onAdd} lightBg={true} />
      </TableCaption>
      <TableHeader>
        <TableRow className="!text-base hover:!bg-transparent">
          <TableHead className="!table-cell">
            <SortBy value={sortBy} onChange={handleSort} type={"title"} />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <SortBy value={sortBy} onChange={handleSort} type={"author"} />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <SortBy value={sortBy} onChange={handleSort} type={"publisher"} />
          </TableHead>
          <TableHead className="w-24 hidden md:table-cell">
            <div className="flex justify-center items-center">
              <SortBy value={sortBy} onChange={handleSort} type={"pages"} />
            </div>
          </TableHead>
          <TableHead className="w-24 hidden md:table-cell">
            <div className="flex justify-center items-center">
              <SortBy value={sortBy} onChange={handleSort} type={"price"} />
            </div>
          </TableHead>
          <TableHead className="w-24 hidden md:table-cell">
            <div className="flex justify-center items-center">
              <SortBy value={sortBy} onChange={handleSort} type={"status"} />
            </div>
          </TableHead>
          <TableHead colSpan={isMobile ? 1 : 3} className="!table-cell">
            <div
              className={
                isMobile
                  ? "flex justify-end items-center"
                  : "flex justify-center items-center"
              }
            >
              <FilterBy value={filterBy} onChange={setFilterBy} />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedBooks.map((b) => (
          <TableRow
            key={b.id}
            onClick={isMobile ? () => handleClicked(b.id) : undefined}
            className={isMobile ? "cursor-pointer" : ""}
          >
            <TableCell
              colSpan={isMobile ? 2 : 1}
              className="!table-cell !max-w-36"
            >
              {b.title}
            </TableCell>
            <TableCell className="!max-w-36">{b.author}</TableCell>
            <TableCell className="!max-w-26">{b.publisher ?? "-"}</TableCell>
            <TableCell className="!text-center !w-24">
              {b.pages ?? "-"}
            </TableCell>
            <TableCell
              className={
                (b.price === 0 && "text-[var(--green)] font-bold") +
                " text-center w-24"
              }
            >
              {b.price > 0 ? "R$ " + b.price.toFixed(2) : "Free"}
            </TableCell>
            <TableCell className="text-center max-w-24">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={() => toggleStatus(b)}
                    className={
                      (b.status == "Read"
                        ? "bg-[var(--light-blue)] hover:bg-[var(--dark-blue)] active:bg-[var(--dark-blue)]"
                        : b.status == "Unread"
                          ? "bg-[var(--light-red)] hover:bg-[var(--dark-red)] active:bg-[var(--dark-red)]"
                          : b.status == "Reading"
                            ? "bg-[var(--light-yellow)] hover:bg-[var(--dark-yellow)] active:bg-[var(--dark-yellow)]"
                            : "bg-[var(--dark-slate)] hover:bg-[var(--medium-slate)] active:bg-[var(--medium-slate)]") +
                      " text-sm text-[var(--light-slate)] rounded-3xl px-2 py-1 cursor-pointer flex justify-center items-center gap-2 duration-200 select-none"
                    }
                  >
                    {b.status}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Change status</TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className="w-8 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <SeeAction book={b} handles={handles} />
              </div>
            </TableCell>
            <TableCell className="w-8 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <EditAction book={b} onEdit={handles.onEdit} />
              </div>
            </TableCell>
            <TableCell className="w-8 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <DeleteAction book={b} onDelete={handles.onDelete} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {clickedBook && (
        <SeeAction noButtonMode={true} book={clickedBook} handles={handles} />
      )}
    </Table>
  );
};

export default TableBook;
