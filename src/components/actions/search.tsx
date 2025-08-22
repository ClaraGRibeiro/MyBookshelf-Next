"use client";

// components shadcn
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// components
import { useEffect, useState, useRef } from "react";
import SeeAction from "./seeaction";
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";

type SearchProps = {
  books: Book[];
  handles: Handles;
};

const Search = ({ books, handles }: SearchProps) => {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // get only books that contain the letters in the title, author, or publisher, and sort them
  const foundBooks = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.publisher?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  // when a book is selected, the search input is cleared
  const handleSelectBook = (bookId: number | null) => {
    if (bookId === selectedBookId) {
      setSelectedBookId(null);
      setTimeout(() => setSelectedBookId(bookId), 0);
    } else setSelectedBookId(bookId);
    setSearch("");
  };
  const selectedBook = books.find((b) => b.id === selectedBookId) || null;
  // refers to the search input
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // listen for clicks outside the search input and unfocus the search
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };

    // listen for scroll events and unfocus the search input
    const handleScroll = () => {
      setSearchFocused(false);
      inputRef.current?.blur();
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="relative flex items-center" ref={containerRef}>
        <MagnifyingGlassIcon className="absolute left-3 !w-5 !h-5" />
        {search.length > 0 && ( // if there is text typed, show an X button to clear the search
          <Cross2Icon
            className="absolute right-3 z-1 cursor-pointer !w-5 !h-5"
            onClick={() => {
              setSearch("");
              setSelectedBookId(null);
            }}
          />
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              ref={inputRef}
              className="px-10 relative w-full border border-[var(--light-slate)]"
              placeholder="Search"
              type="text"
              value={search}
              onFocus={() => {
                setSearchFocused(true);
              }}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchFocused(true);
              }} // if typing, update the search and set it as focused
            />
          </TooltipTrigger>
          <TooltipContent>Search by title, publisher or author</TooltipContent>
        </Tooltip>

        {search.length > 0 &&
          searchFocused && ( // if some text was typed and the search is focused, show the results
            <div className="absolute w-full top-full w-screcth z-1 max-h-32 overflow-y-auto bg-[var(--medium-slate)] text-[var(--light-slate)] text-sm">
              {foundBooks.length > 0 ? ( // if books were find, show them
                foundBooks.map((b) => (
                  <p
                    className="border border-b border-[var(--dark-slate)] hover:bg-[var(--dark-slate)] active:bg-[var(--dark-slate)] p-2 hover:cursor-pointer active:cursor-pointer"
                    key={b.id}
                    onClick={() => handleSelectBook(b.id)}
                  >
                    {b.title}
                  </p>
                ))
              ) : (
                // if no books were find, show a message
                <p
                  className="border border-b border-[var(--dark-slate)] hover:bg-[var(--dark-slate)] active:bg-[var(--dark-slate)] p-2 select-none cursor-not-allowed"
                  onClick={() => handleSelectBook(null)}
                >
                  No books found
                </p>
              )}
            </div>
          )}
      </div>

      {selectedBook && ( // if a book was clicked, open the modal
        <SeeAction noButtonMode={true} book={selectedBook} handles={handles} />
      )}
    </>
  );
};

export default Search;
