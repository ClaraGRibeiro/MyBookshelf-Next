"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { Grid2X2, Pin, PinOff, TableOfContents } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import DrawerCharts from "./drawerCharts";
import Grid from "./grid";
import Rows from "./rows";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type BookShelfProps = {
  books: Book[];
  handles: Handles;
};

export default function Bookshelf({ books, handles }: BookShelfProps) {
  const [pinReadings, setPinReadings] = useState(false);
  const [grid, setGrid] = useState(true);
  return (
    <main
      id="share-image"
      className="px-12 pt-16 py-24 text-[var(--dark-slate)]"
    >
      <div className="fixed bottom-14 right-2 flex flex-col gap-4 items-center justify-center">
        <Button
          className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer !duration-200 p-0 hover:bg-transparent active:bg-transparent"
          variant="ghost"
          onClick={() => setGrid((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {!grid ? (
                  <Grid2X2 strokeWidth={1.5} className="md-icon" />
                ) : (
                  <TableOfContents strokeWidth={1.5} className="md-icon" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>{!grid ? "View grid" : "View rows"}</TooltipContent>
          </Tooltip>
        </Button>

        <Button
          className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer !duration-200 p-0 hover:bg-transparent active:bg-transparent"
          variant="ghost"
          onClick={() => setPinReadings((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {pinReadings ? (
                  <PinOff strokeWidth={1.5} className="md-icon" />
                ) : (
                  <Pin strokeWidth={1.5} className="md-icon" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>Pin readings on the top</TooltipContent>
          </Tooltip>
        </Button>

        {books.filter((b) => b.status === "Read").length > 0 && (
          <DrawerCharts books={books} handles={handles} />
        )}
      </div>
      <h1 className="text-center text-3xl mb-12 font-bold">My BookShelf</h1>

      {grid ? (
        <Grid books={books} handles={handles} pinReadings={pinReadings} />
      ) : (
        <Rows books={books} handles={handles} pinReadings={pinReadings} />
      )}
      <Toaster />
    </main>
  );
}
