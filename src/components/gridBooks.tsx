"use client";

// icons radix
import { BookmarkFilledIcon, CaretSortIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useState } from "react";
import SeeAction from "./actions/seeaction";
import AddAction from "./actions/addaction";
import FilterBy from "./actions/filterBy";
import SortBy from "./actions/sortBy";

type GridBooksProps = {
  books: Book[];
  handles: Handles;
  pinReadings: Boolean;
};

const GridBooks = ({ books, handles, pinReadings }: GridBooksProps) => {
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
      ...books.filter((b) => b.status !== "Reading").sort(compareBooks),
    ];
  } else {
    sortedBooks = [...books.sort(compareBooks)];
  }

  if (filterBy) {
    if (filterBy === "Owned" || filterBy === "Borrowed") {
      sortedBooks = sortedBooks.filter((b) => b.ownership === filterBy);
    } else if (filterBy === "Physical" || filterBy === "Digital") {
      sortedBooks = sortedBooks.filter((b) => b.mode === filterBy);
    } else {
      sortedBooks = sortedBooks.filter((b) => b.status === filterBy);
    }
  }

  const handleClicked = (bId: number) => {
    if (bId === clickedBookId) {
      setClickedBookId(null);
      setTimeout(() => setClickedBookId(bId), 0);
    } else setClickedBookId(bId);
  };
  const clickedBook = books.find((b) => b.id === clickedBookId) || null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
        <SortBy value={sortBy} onChange={handleSort} type={"title"} />
        <SortBy value={sortBy} onChange={handleSort} type={"author"} />
        <SortBy value={sortBy} onChange={handleSort} type={"publisher"} />
        <SortBy value={sortBy} onChange={handleSort} type={"pages"} />
        <SortBy value={sortBy} onChange={handleSort} type={"price"} />
        <SortBy value={sortBy} onChange={handleSort} type={"status"} />
        <FilterBy value={filterBy} onChange={setFilterBy} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
        {sortedBooks.map((b) => (
          <div
            key={b.id}
            className={
              (b.status === "Reading" &&
                "border-4 border-[var(--light-yellow)] hover:border-[var(--dark-yellow)] active:border-[var(--dark-yellow)] ") +
              "aspect-[2/3] relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
            }
            onClick={() => handleClicked(b.id)}
          >
            <img
              className="w-full h-full object-cover"
              src={b.image || "nobookcover.png"}
              alt={b.title}
              title={"(" + b.status + ") " + b.title}
            />
            <BookmarkFilledIcon
              className={
                (b.status == "Read"
                  ? "group-hover:text-[var(--dark-blue)] text-[var(--light-blue)]"
                  : b.status == "Unread"
                    ? "group-hover:text-[var(--dark-red)] text-[var(--light-red)]"
                    : "group-hover:text-[var(--dark-yellow)] text-[var(--light-yellow)]") +
                " absolute top-0 right-0 p-0 m-0 duration-200 h-8 w-8 group-hover:opacity-100 group-active:opacity-100"
              }
            />
            {!b.image && (
              <span className="absolute transform top-[30%] left-[15%] text-center w-[75%] max-h-[90%] select-none text-xl break-words font-bold text-[var(--light-slate)]">
                {b.title}
              </span>
            )}
            {b.ownership === "Borrowed" && (
              <span className="absolute left-0 bottom-0 text-center select-none text-lg font-semibold text-[var(--light-slate)] bg-[var(--dark-slate)] group-hover:text-[var(--dark-slate)] group-active:text-[var(--dark-slate)] group-hover:bg-[var(--light-slate)] group-active:bg-[var(--light-slate)] px-4 py-1 rounded-tr-3xl !duration-200">
                {b.ownership}
              </span>
            )}
          </div>
        ))}
        <div className="flex items-center justify-center">
          <AddAction
            books={books}
            onAdd={handles.onAdd}
            large={true}
            lightBg={true}
          />
        </div>
        {clickedBook && (
          <SeeAction noButtonMode={true} book={clickedBook} handles={handles} />
        )}
      </div>
    </>
  );
};

export default GridBooks;
