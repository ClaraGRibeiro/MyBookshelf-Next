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
import { useEffect, useState } from "react";
import {
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ViewGridIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import DrawerCharts from "./drawerCharts";

type BookShelfProps = {
  books: Book[];
  handles: Handles;
};

const Bookshelf = ({ books, handles }: BookShelfProps) => {
  const [top3, setTop3] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/amazonAPI");
      const data = await res.json();
      setTop3(data);
      console.log(data);
    })();
  }, []);

  const [pinReadings, setPinReadings] = useState(false);
  const [grid, setGrid] = useState(true);
  return (
    <main className="px-12 pt-16 py-24 text-[var(--dark-slate)]">
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
                  <ViewGridIcon className="!w-5 !h-5" />
                ) : (
                  <ListBulletIcon className="!w-5 !h-5" />
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
                  <DrawingPinFilledIcon className="!w-6 !h-6" />
                ) : (
                  <DrawingPinIcon className="!w-6 !h-6" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>Pin readings on the top</TooltipContent>
          </Tooltip>
        </Button>

        {books.filter((b) => b.status === "Read").length > 0 && (
          <DrawerCharts books={books} />
        )}
      </div>

      <h1 className="text-center text-3xl mb-12 font-bold">My BookShelf</h1>

      {grid ? (
        <GridBooks books={books} handles={handles} pinReadings={pinReadings} />
      ) : (
        <TableBook books={books} handles={handles} pinReadings={pinReadings} />
      )}
      {!top3 ? (
        <h2 className="text-center text-xl mt-20 font-bold">
          Loading 3 Tops...
        </h2>
      ) : (
        <div className="mt-20">
          <h2 className="text-center text-xl mb-12 font-bold">
            3 Tops Amazon BR
          </h2>
          <ul className="flex gap-8 items-start justify-betw mx-auto w-fit">
            {top3?.map((book) => (
              <li
                key={book.rank}
                className="flex items-center gap-3"
                onClick={() => window.open(book.link, "_blank")}
              >
                <div
                  className={
                    "aspect-[2/3] relative w-24 hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
                  }
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    width={50}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p>({book.category})</p>
                  <p className="font-semibold">{book.title.split(":")[0]}</p>
                  <p className="text-sm text-[var(--medium-slate)]">
                    {book.author}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default Bookshelf;
