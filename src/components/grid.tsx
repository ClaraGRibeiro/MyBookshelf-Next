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
import Card from "./card";

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
      <div className="flex items-center justify-center md:flex-row flex-col gap-2 md:gap-12 mb-2">
        <p className="text-center font-light text-[var(--medium-slate)]">
          Sort by {sortBy.toUpperCase()} [{sortAsc ? "asc" : "desc"}]
        </p>
        <p className="text-center font-light text-[var(--medium-slate)]">
          Filter by {filterBy ? filterBy!.toUpperCase() : "ALL"} [
          {sortedBooks.length} books]
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center content-start">
        {sortedBooks.map((b) => (
          <Card key={b.id} book={b} onClick={handleClicked} />
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
