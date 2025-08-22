"use client";

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
// icons radix
import { BookmarkFilledIcon, CaretSortIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useState } from "react";
import SeeAction from "./actions/seeaction";
import AddAction from "./actions/addaction";
import FilterBy from "./actions/filterBy";

type GridBooksProps = {
  books: Book[];
  handles: Handles;
  pinReadings: Boolean;
};

const GridBooks = ({ books, handles, pinReadings }: GridBooksProps) => {
  const [clickedBookId, setClickedBookId] = useState<number | null>(null);
  const [filterBy, setFilterBy] = useState<Book["status"] | null>(null);
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
    const readings = books
      .filter((b) => b.status === "Reading")
      .sort(compareBooks);
    const others = books
      .filter((b) => b.status !== "Reading")
      .sort(compareBooks);
    sortedBooks = [...readings, ...others];
  } else {
    sortedBooks = [...books].sort(compareBooks);
  }
  if (filterBy) {
    sortedBooks = sortedBooks.filter((b) => b.status === filterBy);
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("title")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Book Title
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Book Title
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("author")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Author
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Author
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("publisher")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Publisher
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Publisher
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("pages")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Pages
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Pages
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("price")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Price
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Price
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={() => handleSort("status")}
              className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
            >
              Status
              <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded text-center">
            Sort by Status
          </TooltipContent>
        </Tooltip>
        <FilterBy value={filterBy} onChange={setFilterBy} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
        {sortedBooks.map((b) => (
          <div
            key={b.id}
            className={
              (b.status === "Reading" && "shadow-[0_0_40px_#fbac0f]") +
              " aspect-[2/3] relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
            }
            onClick={() => handleClicked(b.id)}
          >
            <img
              className="w-full h-full object-cover"
              src={b.image || "nobookcover.png"}
              alt={b.title}
              title={b.status + " ~ " + b.title}
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
              <span className="absolute transform top-1/3 -translate-y-1/4 right-0 -translate-x-3 text-center line-clamp-2 w-[75%] max-h-[90%] select-none text-xl break-words font-bold text-[var(--light-slate)]">
                {b.title}
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
