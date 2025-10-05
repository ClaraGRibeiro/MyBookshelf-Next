"use client";

import { Book } from "@/types/books";
import { Bookmark } from "lucide-react";

type Props = {
  book: Book;
  onClick: (id: number) => void;
  drawerMode?: boolean;
};

export default function Card({ book, onClick, drawerMode = false }: Props) {
  return (
    <div
      key={book.id}
      className={
        (book.status === "Reading" && !drawerMode
          ? "border-4 border-(--light-yellow) hover:border-(--dark-yellow) active:border-(--dark-yellow) "
          : book.status === "Next" && !drawerMode
            ? "border-4 border-(--medium-slate) hover:border-(--dark-slate) active:border-(--dark-slate) "
            : "") +
        "aspect-[2/3] relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
      }
      onClick={() => onClick(book.id)}
    >
      {!drawerMode && (
        <div
          className="w-full flex text-xs flex-col items-center text-center text-(--dark-slate) absolute left-0 top-0"
          style={{ pointerEvents: "none" }}
        >
          <span>[{book.title}]</span>
          <br />
          <span className="text-(--medium-slate)">
            Could not load book cover image!
          </span>
        </div>
      )}
      <img
        className="w-full h-full object-cover relative"
        src={book.image || "/nobookcover.png"}
        alt={book.title}
        title={`(${book.status}) ${book.title}`}
      />
      {!drawerMode && (
        <>
          {!book.image && (
            <span className="absolute transform top-[20%] lg:top-[10%] left-[15%] text-center w-[75%] max-h-[90%] select-none text-xl lg:text-base break-words text-(--light-slate)">
              {book.title}
            </span>
          )}

          <Bookmark
            strokeWidth={1.5}
            className={
              (book.status == "Read"
                ? "fill-(--light-blue) dark:!fill-(--dark-blue) dark:!stroke-(--light-blue) stroke-(--dark-blue)"
                : book.status == "Unread"
                  ? "fill-(--light-red) dark:!fill-(--dark-red) dark:!stroke-(--light-red) stroke-(--dark-red)"
                  : book.status == "Reading"
                    ? "fill-(--light-yellow) dark:!fill-(--dark-yellow) dark:!stroke-(--light-yellow) stroke-(--dark-yellow)"
                    : "fill-(--medium-slate) dark:!fill-(--medium-slate)") +
              " absolute top-0 right-0 p-0 m-0 duration-200 h-8 w-8 group-hover:opacity-100 group-active:opacity-100"
            }
          />

          {book.mode === "Digital" && (
            <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-(--light-slate) bg-(--medium-slate) group-hover:text-(--dark-slate) group-active:text-(--dark-slate) group-hover:bg-(--light-slate) group-active:bg-(--light-slate) px-2 py-1 rounded-tr-lg !duration-200">
              {book.mode}
            </span>
          )}

          {book.ownership === "Borrowed" && (
            <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-(--light-slate) bg-(--medium-slate) group-hover:text-(--dark-slate) group-active:text-(--dark-slate) group-hover:bg-(--light-slate) group-active:bg-(--light-slate) px-2 py-1 rounded-tr-lg !duration-200">
              {book.ownership}
            </span>
          )}
        </>
      )}
    </div>
  );
}
