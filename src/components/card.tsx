"use client";

import { useState } from "react";
import { Book } from "@/types/books";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";

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
          ? "border-4 border-[var(--light-yellow)] hover:border-[var(--dark-yellow)] active:border-[var(--dark-yellow)] "
          : book.status === "Next" && !drawerMode
            ? "border-4 border-[var(--medium-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] "
            : "") +
        "aspect-[2/3] relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
      }
      onClick={() => onClick(book.id)}
    >
      {!drawerMode && (
        <div
          className="w-full flex justify-between gap-4 flex-col items-center text-center text-[var(--dark-slate)] absolute left-0 top-0"
          style={{ pointerEvents: "none" }}
        >
          <span>[{book.title}]</span>
          <br />
          <span className="text-[var(--medium-slate)]">
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
            <span className="absolute transform top-[20%] lg:top-[10%] left-[15%] text-center w-[75%] max-h-[90%] select-none text-xl lg:text-base break-words text-[var(--light-slate)]">
              {book.title}
            </span>
          )}

          <BookmarkFilledIcon
            className={
              (book.status == "Read"
                ? "text-[var(--light-blue)] dark:!text-[var(--dark-blue)] dark:!stroke-[var(--light-blue)] stroke-[var(--dark-blue)]"
                : book.status == "Unread"
                  ? "text-[var(--light-red)] dark:!text-[var(--dark-red)] dark:!stroke-[var(--light-red)] stroke-[var(--dark-red)]"
                  : book.status == "Reading"
                    ? "text-[var(--light-yellow)] dark:!text-[var(--dark-yellow)] dark:!stroke-[var(--light-yellow)] stroke-[var(--dark-yellow)]"
                    : "text-[var(--medium-slate)] dark:!text-[var(-medium-slate)]") +
              " absolute top-0 right-0 p-0 m-0 duration-200 h-8 w-8 group-hover:opacity-100 group-active:opacity-100"
            }
            strokeWidth={0.5}
          />

          {book.mode === "Digital" && (
            <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-[var(--light-slate)] bg-[var(--medium-slate)] group-hover:text-[var(--dark-slate)] group-active:text-[var(--dark-slate)] group-hover:bg-[var(--light-slate)] group-active:bg-[var(--light-slate)] px-2 py-1 rounded-tr-lg !duration-200">
              {book.mode}
            </span>
          )}

          {book.ownership === "Borrowed" && (
            <span className="absolute left-0 bottom-0 text-center select-none text-base font-semibold text-[var(--light-slate)] bg-[var(--medium-slate)] group-hover:text-[var(--dark-slate)] group-active:text-[var(--dark-slate)] group-hover:bg-[var(--light-slate)] group-active:bg-[var(--light-slate)] px-2 py-1 rounded-tr-lg !duration-200">
              {book.ownership}
            </span>
          )}
        </>
      )}
    </div>
  );
}
