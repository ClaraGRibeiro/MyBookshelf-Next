"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import Forms from "./actions/forms";
import { Isbn } from "./actions/isbn";
import Search from "./actions/search";
import Shuffle from "./actions/shuffle";
import Theme from "./actions/theme";
import Xlsx from "./actions/xlsx";

type HeaderProps = {
  books: Book[];
  handles: Handles;
};

export default function Header({ books, handles }: HeaderProps) {
  return (
    <header className="h-fill flex-wrap dark:bg-[var(--medium-slate)] bg-[var(--dark-slate)] flex lg:justify-between justify-center lg:flex-row flex-col items-center py-3 px-12 gap-4">
      <a className="flex items-center gap-2" href="/">
        <img className="md:h-12 h-10" src="books.png" alt="Logo" />
        <h1 className="text-[var(--light-slate)] text-2xl md:text-xl font-bold">
          NextBook
        </h1>
      </a>
      <div className="flex flex-wrap-reverse justify-center items-center gap-4 md:gap-6">
        <div className="flex gap-6 items-center">
          <Forms isEdit={false} onAdd={handles.onAdd} />
          <Shuffle books={books} handles={handles} />
          <Xlsx books={books} />
          <Theme />
          <Isbn books={books} handles={handles} />
        </div>
        <Search books={books} handles={handles} />
      </div>
    </header>
  );
}
