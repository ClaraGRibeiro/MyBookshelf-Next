"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { Dices } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import See from "./see";

type ShuffleProps = {
  books: Book[];
  handles: Handles;
};

export default function Shuffle({ books, handles }: ShuffleProps) {
  const [chosenBookId, setChosenBookId] = useState<number | null>(null);
  const handleShuffleBook = () => {
    const unreadBooks = books.filter((b) => b?.status !== "Read");
    if (unreadBooks.length === 0) {
      toast("❌ ERROR", {
        description: "No unread books available to shuffle.",
      });
      return;
    }
    setChosenBookId(
      unreadBooks[Math.floor(Math.random() * unreadBooks.length)].id,
    );
  };
  const chosenBook = books.find((b) => b.id === chosenBookId) || null;

  return (
    <>
      <Button
        variant="own"
        className="hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)]"
        onClick={() => {
          handleShuffleBook();
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] group-active:!text-[var(--dark-slate)] btn-content">
              <Dices strokeWidth={1.5} className="cursor-pointer md-icon" />
            </span>
          </TooltipTrigger>
          <TooltipContent>Randomly choose the next book</TooltipContent>
        </Tooltip>
      </Button>
      {chosenBook && (
        <See noButtonMode={true} book={chosenBook} handles={handles} />
      )}
    </>
  );
}
