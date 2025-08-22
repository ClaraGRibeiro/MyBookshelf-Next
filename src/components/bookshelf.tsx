"use client";

// components shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
// components próprios
import TableBook from "./tableBooks";
import GridBooks from "./gridBooks";
// import Charts from './charts'
import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { useState } from "react";
import {
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ViewGridIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { DrawerCharts } from "./drawerCharts";

type BookShelfProps = {
  books: Book[];
  handles: Handles;
};

const Bookshelf = ({ books, handles }: BookShelfProps) => {
  const [pinReadings, setPinReadings] = useState(false);
  const [grid, setGrid] = useState(true);
  return (
    <main className="px-12 pt-16 py-24 text-[var(--dark-slate)]">
      <div className="fixed bottom-14 right-2 flex flex-col gap-4 items-center justify-center">
        <Button
          className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent"
          variant="ghost"
          onClick={() => setGrid((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {!grid ? (
                  <ViewGridIcon className="!w-5 !h-5" />
                ) : (
                  <ListBulletIcon className="!w-5 !h-5" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded">
              {!grid ? "View grid" : "View rows"}
            </TooltipContent>
          </Tooltip>
        </Button>

        <Button
          className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent"
          variant="ghost"
          onClick={() => setPinReadings((prev) => !prev)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {pinReadings ? (
                  <DrawingPinFilledIcon className="!w-6 !h-6" />
                ) : (
                  <DrawingPinIcon className="!w-6 !h-6" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded">
              Pin readings on the top
            </TooltipContent>
          </Tooltip>
        </Button>

        <DrawerCharts books={books} />
      </div>

      <h1 className="text-center text-3xl mb-12 font-bold">My BookShelf</h1>

      {grid ? (
        <GridBooks books={books} handles={handles} pinReadings={pinReadings} />
      ) : (
        <TableBook books={books} handles={handles} pinReadings={pinReadings} />
      )}
    </main>
  );
};

export default Bookshelf;
