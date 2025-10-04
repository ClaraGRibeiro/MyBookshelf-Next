"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import Forms from "./actions/forms";
import { Isbn } from "./actions/isbn";
import Search from "./actions/search";
import Shuffle from "./actions/shuffle";
import Theme from "./actions/theme";
import Xlsx from "./actions/xlsx";
import Share from "./actions/share";

type HeaderProps = {
  books: Book[];
  handles: Handles;
};

export default function Header({ books, handles }: HeaderProps) {
  return (
    <header className="dark:bg-[var(--medium-slate)] bg-[var(--dark-slate)] flex lg:justify-between justify-center lg:flex-row flex-col items-center py-4 px-12 gap-4">
      <a className="flex items-center gap-2" href="/">
        <img className="md:h-12 h-10" src="books.png" alt="Logo" />
        <h1 className="text-[var(--light-slate)] text-2xl md:text-xl font-bold">
          NextBook
        </h1>
      </a>
      <div className="flex justify-center items-center gap-4 lg:flex-row flex-col">
        <div className="flex gap-4 items-center">
          <Isbn books={books} handles={handles} />
          <Shuffle books={books} handles={handles} />
          <Xlsx books={books} />
          <Share />
          <Theme />
        </div>
        <div className="flex gap-4 items-center">
          <Search books={books} handles={handles} />
          <Forms isEdit={false} onAdd={handles.onAdd} />
        </div>
      </div>
    </header>
  );
}
