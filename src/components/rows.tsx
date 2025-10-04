"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import Delete from "./actions/delete";
import Filter from "./actions/filter";
import Forms from "./actions/forms";
import order from "./actions/order";
import See from "./actions/see";
import Sort from "./actions/sort";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type RowsProps = {
  books: Book[];
  handles: Handles;
  pinReadings: boolean;
};

export default function Rows({ books, handles, pinReadings }: RowsProps) {
  const [clickedBookId, setClickedBookId] = useState<number | null>(null);
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

  const sortedBooks: Book[] = order({
    books,
    sortBy,
    sortAsc,
    pinReadings,
    filterBy,
  });

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

  const handleClicked = (bId: number) => {
    if (bId === clickedBookId) {
      setClickedBookId(null);
      setTimeout(() => setClickedBookId(bId), 0);
    } else setClickedBookId(bId);
  };
  const clickedBook = books.find((b) => b.id === clickedBookId) || null;

  return (
    <>
      <div className="flex items-center justify-center md:flex-row flex-col gap-2 md:gap-12 mb-2">
        <p className="text-center font-light text-[var(--medium-slate)]">
          Sort by {sortBy.toUpperCase()} [{sortAsc ? "asc" : "desc"}]
        </p>
        <p className="text-center font-light text-[var(--medium-slate)]">
          Filter by {filterBy ? filterBy!.toUpperCase() : "ALL"} [
          {sortedBooks.length} books]
        </p>
      </div>
      <Table className="text-lg">
        <TableCaption>
          <Forms isEdit={false} onAdd={handles.onAdd} />
        </TableCaption>
        <TableHeader>
          <TableRow className="!text-base hover:!bg-transparent">
            <TableHead className="!table-cell">
              <Sort value={sortBy} onChange={handleSort} type={"title"} />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Sort value={sortBy} onChange={handleSort} type={"author"} />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Sort value={sortBy} onChange={handleSort} type={"publisher"} />
            </TableHead>
            <TableHead className="w-24 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <Sort value={sortBy} onChange={handleSort} type={"pages"} />
              </div>
            </TableHead>
            <TableHead className="w-24 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <Sort value={sortBy} onChange={handleSort} type={"price"} />
              </div>
            </TableHead>
            <TableHead className="w-24 hidden md:table-cell">
              <div className="flex justify-center items-center">
                <Sort value={sortBy} onChange={handleSort} type={"status"} />
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
                <Filter value={filterBy} onChange={setFilterBy} />
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
                {b.title} {b.subtitle ? "- " + b.subtitle : ""}
              </TableCell>
              <TableCell className="!max-w-36">{b.author}</TableCell>
              <TableCell className="!max-w-26">{b.publisher ?? "-"}</TableCell>
              <TableCell className="!text-center !w-24">
                {b.pages ?? "-"}
              </TableCell>
              <TableCell
                className={
                  (Number(b.price) === 0 && "text-[var(--green)] font-bold") +
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
                  <See book={b} handles={handles} />
                </div>
              </TableCell>
              <TableCell className="w-8 hidden md:table-cell">
                <div className="flex justify-center items-center">
                  <Forms isEdit={true} book={b} onEdit={handles.onEdit} />
                </div>
              </TableCell>
              <TableCell className="w-8 hidden md:table-cell">
                <div className="flex justify-center items-center">
                  <Delete book={b} onDelete={handles.onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {clickedBook && (
          <See noButtonMode={true} book={clickedBook} handles={handles} />
        )}
      </Table>
    </>
  );
}
