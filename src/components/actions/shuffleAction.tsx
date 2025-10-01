"use client";

// components shadcn
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { ShuffleIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useState } from "react";
import { toast } from "sonner";
import SeeAction from "./seeAction";

type ShuffleActionProps = {
  books: Book[];
  handles: Handles;
};

const ShuffleAction = ({ books, handles }: ShuffleActionProps) => {
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
              <ShuffleIcon className="cursor-pointer !w-6 !h-6" />
            </span>
          </TooltipTrigger>
          <TooltipContent>Randomly choose the next book</TooltipContent>
        </Tooltip>
      </Button>
      {chosenBook && (
        <SeeAction noButtonMode={true} book={chosenBook} handles={handles} />
      )}
    </>
  );
};

export default ShuffleAction;
