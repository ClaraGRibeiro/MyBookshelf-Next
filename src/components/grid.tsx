"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Filter from "./actions/filter";
import Forms from "./actions/forms";
import order from "./actions/order";
import See from "./actions/see";
import Sort from "./actions/sort";

type GridProps = {
  books: Book[];
  handles: Handles;
  pinReadings: boolean;
};

export default function Grid({ books, handles, pinReadings }: GridProps) {
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

  const handleClicked = (bId: number) => {
    if (bId === clickedBookId) {
      setClickedBookId(null);
      setTimeout(() => setClickedBookId(bId), 0);
    } else setClickedBookId(bId);
  };
  const clickedBook = books.find((b) => b.id === clickedBookId) || null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-2">
        <Sort value={sortBy} onChange={handleSort} type={"title"} />
        <Sort value={sortBy} onChange={handleSort} type={"author"} />
        <Sort value={sortBy} onChange={handleSort} type={"publisher"} />
        <Sort value={sortBy} onChange={handleSort} type={"pages"} />
        <Sort value={sortBy} onChange={handleSort} type={"price"} />
        <Sort value={sortBy} onChange={handleSort} type={"status"} />
        <Sort value={sortBy} onChange={handleSort} type={"gotDate"} />
        <Sort value={sortBy} onChange={handleSort} type={"readDate"} />
        <Filter value={filterBy} onChange={setFilterBy} />
      </div>
      <p className="text-center mb-8 font-light text-[var(--medium-slate)]">
        {sortedBooks.length} books [{filterBy ?? "All"}]
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center content-start">
        {sortedBooks.map((b) => (
          <div
            key={b.id}
            className={
              (b.status === "Reading"
                ? "border-4 border-[var(--light-yellow)] hover:border-[var(--dark-yellow)] active:border-[var(--dark-yellow)] "
                : b.status === "Next"
                  ? "border-4 border-[var(--medium-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] "
                  : "") +
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
                  ? "text-[var(--light-blue)] dark:!text-[var(--dark-blue)] dark:!stroke-[var(--light-blue)] stroke-[var(--dark-blue)]"
                  : b.status == "Unread"
                    ? "text-[var(--light-red)] dark:!text-[var(--dark-red)] dark:!stroke-[var(--light-red)] stroke-[var(--dark-red)]"
                    : b.status == "Reading"
                      ? "text-[var(--light-yellow)] dark:!text-[var(--dark-yellow)] dark:!stroke-[var(--light-yellow)] stroke-[var(--dark-yellow)]"
                      : "text-[var(--medium-slate)] dark:!text-[var(-medium-slate)]") +
                " absolute top-0 right-0 p-0 m-0 duration-200 h-8 w-8 group-hover:opacity-100 group-active:opacity-100"
              }
              strokeWidth={0.5}
            />
            {!b.image && (
              <span className="absolute transform top-[30%] left-[15%] text-center w-[75%] max-h-[90%] select-none text-xl break-words font-bold text-[var(--light-slate)]">
                {b.title}
              </span>
            )}
            {b.mode === "Digital" && (
              <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-[var(--light-slate)] bg-[var(--medium-slate)] group-hover:text-[var(--dark-slate)] group-active:text-[var(--dark-slate)] group-hover:bg-[var(--light-slate)] group-active:bg-[var(--light-slate)] px-2 py-1 rounded-tr-lg !duration-200">
                {b.mode}
              </span>
            )}
            {b.ownership === "Borrowed" && (
              <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-[var(--light-slate)] bg-[var(--medium-slate)] group-hover:text-[var(--dark-slate)] group-active:text-[var(--dark-slate)] group-hover:bg-[var(--light-slate)] group-active:bg-[var(--light-slate)] px-2 py-1 rounded-tr-lg !duration-200">
                {b.ownership}
              </span>
            )}
          </div>
        ))}
        <div className="aspect-[2/3] h-full w-full relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group">
          <Forms
            isEdit={false}
            onAdd={handles.onAdd}
            large={true}
            lightBg={true}
          />
        </div>
        {clickedBook && (
          <See noButtonMode={true} book={clickedBook} handles={handles} />
        )}
      </div>
    </>
  );
}
