"use client";

// components
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import Download from "./actions/download";
import Search from "./actions/search";
import ShuffleAction from "./actions/shuffleAction";
import ThemeToggle from "./actions/themeToggle";
import BookForm from "./actions/form";

type HeaderProps = {
  books: Book[];
  handles: Handles;
};

export default function Header({ books, handles }: HeaderProps) {
  return (
    <header className="h-fill flex-wrap dark:bg-[var(--medium-slate)] bg-[var(--dark-slate)] flex md:justify-between justify-center items-center py-3 px-12 gap-4">
      <a className="flex items-center gap-2" href="/">
        <img className="md:h-12 h-10" src="books.png" alt="Logo" />
        <h1 className="text-[var(--light-slate)] text-2xl md:text-xl font-bold">
          NextBook
        </h1>
      </a>
      <div className="flex flex-wrap-reverse justify-center items-center gap-4 md:gap-6">
        <div className="flex gap-6 items-center">
          <BookForm isEdit={false} onAdd={handles.onAdd} />
          <ShuffleAction books={books} handles={handles} />
          <Download books={books} />
          <ThemeToggle />
        </div>
        <Search books={books} handles={handles} />
      </div>
    </header>
  );
}
