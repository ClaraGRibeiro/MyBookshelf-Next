"use client";

import { Book } from "@/types/books";
import { Handles } from "@/types/handles";
import { ChartNoAxesCombined, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import See from "./actions/see";
import Card from "./card";
import Charts from "./charts";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Share from "./actions/share";

type DrawerChartsProps = {
  books: Book[];
  handles: Handles;
};

export default function DrawerCharts({ books, handles }: DrawerChartsProps) {
  const [open, setOpen] = useState(false);
  const [clickedBookId, setClickedBookId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setClickedBookId(null);
    }
  }, [open]);
  const handleClicked = (bId: number | null) => {
    if (bId === undefined) return;
    if (bId === clickedBookId) {
      setClickedBookId(null);
      setTimeout(() => setClickedBookId(bId), 0);
    } else {
      setClickedBookId(bId);
    }
  };
  const clickedBook = books.find((b) => b.id === clickedBookId) || null;

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
  const [showBy, setShowBy] = useState<"Books" | "Pages">("Books");
  const booksRead = books.filter((b) => b.status === "Read");
  const allYears = Array.from(
    new Set(booksRead.map((b) => Number(b.readDate?.split("/")[2]))),
  ).sort((x, y) => x - y);
  let booksByYear = [];
  booksByYear = allYears.map((y) => {
    const b = booksRead.filter((b) => Number(b.readDate?.split("/")[2]) === y);
    return {
      name: y.toString(),
      value:
        showBy === "Books"
          ? b.length || 0
          : b.reduce((acc, b) => acc + (b.pages || 0), 0) || 0,
      books: b,
    };
  });
  const readThisYear =
    booksByYear.find((bY) => bY.name === currentYear.toString())?.books || [];
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "short" }),
  );
  const readThisSelectedYear =
    booksRead.filter(
      (b) => Number(b.readDate?.split("/")[2]) === selectedYear,
    ) || [];
  const booksByMonth = monthNames.map((m, i) => {
    const b = readThisSelectedYear.filter(
      (b) => Number(b.readDate?.split("/")[1]) === i + 1,
    );
    return {
      name: m,
      value:
        showBy === "Books"
          ? b.length
          : b.reduce((acc, b) => acc + (b.pages || 0), 0),
      books: b,
    };
  });
  const readThisMonth =
    booksByMonth.find((bM) => bM.name === currentMonth)?.books || [];
  const totalSpent =
    Math.round(books.reduce((acc, b) => acc + Number(b.price), 0) * 100) / 100;
  const totalPagesRead = booksRead.reduce((acc, b) => acc + (b.pages || 0), 0);
  const minutesPerPage = 3.5;
  const timeReading = Math.round((minutesPerPage * totalPagesRead) / 60);
  const bestYear = booksByYear.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    { name: "No reads", value: 0, books: [] },
  );
  const bestMonth = booksByMonth.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    { name: "No reads", value: 0, books: [] },
  );
  const minutesPerDay = 30;
  const pagesThisYear = readThisYear.reduce(
    (acc, b) => acc + (b.pages || 0),
    0,
  );
  const annualPageGoal = Math.round((minutesPerDay * 365) / minutesPerPage);
  const pagesAvgThisYear = pagesThisYear / readThisYear.length;
  const annualBooksGoal = Math.round(annualPageGoal / pagesAvgThisYear);
  const parseDate = (val: string): null | number => {
    if (!val || val === "-") return null;
    const parts = val.split("/");
    if (parts.length !== 3) return 0;
    const d = new Date(parts.reverse().join("-"));
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };
  const compareBooks = (a: Book, b: Book) => {
    const aValue = a["readDate"] ?? "";
    const bValue = b["readDate"] ?? "";
    const aDate = parseDate(aValue as string);
    const bDate = parseDate(bValue as string);
    if (aDate === null && bDate === null) return 0;
    if (aDate === null) return 1;
    if (bDate === null) return -1;
    return bDate - aDate;
  };
  const lastReading = books.sort(compareBooks)[0];
  const currentReading = books.filter((b) => b.status === "Reading")[0];
  const nextReading = books.filter((b) => b.status === "Next")[0];
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button asChild className="" variant="ghost">
          <Tooltip>
            <TooltipTrigger
              asChild
              className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer !duration-200 p-0 hover:bg-transparent active:bg-transparent"
            >
              <span>
                <ChartNoAxesCombined strokeWidth={1.5} className="md-icon" />
              </span>
            </TooltipTrigger>
            <TooltipContent>See statistical data</TooltipContent>
          </Tooltip>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-[90%] w-full overflow-y-auto pb-12">
          <div className="flex flex-wrap justify-center items-center">
            <DrawerHeader>
              <DrawerTitle>My BookShelf Stats</DrawerTitle>
              <DrawerDescription>
                Track reading progress: month by month, year by year.
              </DrawerDescription>
            </DrawerHeader>
            <Share screen="charts" lightBg={true} />
          </div>
          <div
            id="charts"
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="flex flex-col justify-center items-center gap-12 max-w-[70%] md:max-w-120 ">
              <div className="grid grid-cols-2 md:grid-cols-4 md justify-items-center items-center gap-12">
                <p className="text-center">
                  total of <br />
                  <span className="font-bold text-3xl special-colors">
                    {books.length}
                  </span>
                  <br /> books
                </p>
                <p className="text-center">
                  <span className="font-bold text-3xl special-colors">
                    {totalPagesRead}
                  </span>
                  <br /> pages <br /> read
                </p>
                <p className="text-center">
                  about <br />
                  <span className="font-bold text-3xl special-colors">
                    {timeReading}h
                  </span>
                  <br /> reading
                </p>
                <p className="text-center">
                  R$ <br />
                  <span className="font-bold text-3xl special-colors">
                    {totalSpent}
                  </span>
                  <br /> total
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 md justify-items-center items-center gap-12">
                <Charts
                  type="pie"
                  value={booksRead.length}
                  total={books.length}
                  label="Readings"
                  colors={["#006AB3", "#cad5e2"]}
                />
                <Charts
                  type="pie"
                  value={readThisYear.length}
                  total={booksRead.length}
                  label={"In " + currentYear}
                  colors={["#E63431", "#cad5e2"]}
                />
                <div className="col-span-2 flex justify-center md:col-span-1 md:block">
                  <Charts
                    type="pie"
                    value={readThisMonth.length}
                    total={readThisYear.length}
                    label={
                      "In " +
                      new Date().toLocaleString("en-US", { month: "long" })
                    }
                    colors={["#FBAC0F", "#cad5e2"]}
                  />
                </div>
              </div>

              <div className="flex justify-between items-start w-full mb-8">
                <div className="flex flex-col justify-center items-center gap-2">
                  <p className="text-center mb-1 text-sm md:text-base">Last</p>
                  <div className="w-22 md:w-28 lg:w-36 bg-[var(--medium-slate)]">
                    {lastReading ? (
                      <Card
                        key={lastReading.id}
                        book={lastReading}
                        onClick={handleClicked}
                        drawerMode={true}
                      />
                    ) : (
                      <p className="text-center text-[var(--light-slate)]">
                        NONE
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <p className="text-center mb-1 text-sm md:text-base">
                    Current
                  </p>
                  <div className="w-22 md:w-28 lg:w-36 bg-[var(--medium-slate)]">
                    {currentReading ? (
                      <Card
                        key={currentReading.id}
                        book={currentReading}
                        onClick={handleClicked}
                        drawerMode={true}
                      />
                    ) : (
                      <p className="text-center text-[var(--light-slate)]">
                        NONE
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <p className="text-center mb-1 text-sm md:text-base">Next</p>
                  <div className="w-22 md:w-28 lg:w-36 bg-[var(--medium-slate)]">
                    {nextReading ? (
                      <Card
                        key={nextReading.id}
                        book={nextReading}
                        onClick={handleClicked}
                        drawerMode={true}
                      />
                    ) : (
                      <p className="text-center text-[var(--light-slate)]">
                        NONE
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full">
                <p className="text-center text-sm mb-8">
                  If you read just <strong>{minutesPerDay}</strong> minutes a
                  day, at an average pace of <strong>{minutesPerPage}</strong>{" "}
                  minutes per page, in one year you'll finish over{" "}
                  <strong>{annualPageGoal}</strong> pages — about{" "}
                  <strong>{annualBooksGoal}</strong> books of{" "}
                  <strong>{Math.round(pagesAvgThisYear)}</strong> pages each!
                </p>
                <div className="w-full flex justify-between items-baseline gap-12">
                  <span>{`${pagesThisYear} (${readThisYear.length})`}</span>
                  <span className="text-xs">{currentYear}</span>
                  <span>
                    {annualPageGoal - pagesThisYear > 0
                      ? `${annualPageGoal - pagesThisYear} (${annualBooksGoal - readThisYear.length})`
                      : "🎉"}
                  </span>
                </div>
                <Progress value={(pagesThisYear * 100) / annualPageGoal} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="mt-8 cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] group flex-row gap-12 border border-[var(--medium-slate)] rounded px-2 py-1 flex justify-between items-center !duration-200">
                  <span>Show by nº of</span>
                  <ChevronDown
                    strokeWidth={1.5}
                    className="inline group-hover:scale-130 group-active:scale-130 duration-200"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setShowBy("Books")}>
                    Books
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowBy("Pages")}>
                    Pages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex justify-center items-center flex-wrap gap-12">
                <p className="text-center">
                  Best Year <br />
                  <span className="font-bold text-3xl special-colors">
                    {bestYear.name}
                  </span>
                  <br /> ({bestYear.value}{" "}
                  {showBy === "Books" ? "reads" : "pages"})
                </p>
                <p className="text-center">
                  Best Month <br />
                  <span className="font-bold text-3xl special-colors">
                    {bestMonth.name}
                  </span>
                  <br /> ({bestMonth.value}{" "}
                  {showBy === "Books" ? "reads" : "pages"})
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] group flex-row gap-12 border border-[var(--medium-slate)] rounded px-2 py-1 mt-12 mb-1 flex justify-between items-center !duration-200">
                <span>{selectedYear}</span>
                <ChevronDown className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allYears.map((y) => (
                  <DropdownMenuItem key={y} onSelect={() => setSelectedYear(y)}>
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-[96%] flex flex-col lg:flex-row items-center gap-12 justify-between">
              <Charts
                type="bar"
                dataChart={booksByYear}
                label="Books per Year"
                colors={["#006AB3"]}
                showBy={showBy}
              />

              <Charts
                type="bar"
                dataChart={booksByMonth}
                label={"Books per Month (" + new Date().getFullYear() + ")"}
                colors={["#E63431"]}
                showBy={showBy}
              />
            </div>
          </div>
          {clickedBook && (
            <See noButtonMode={true} book={clickedBook} handles={handles} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
