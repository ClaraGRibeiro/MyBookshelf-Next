"use client";

// components shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Progress } from "./ui/progress";
// icons radix
import { BarChartIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon } from "@radix-ui/react-icons";
// components
import Charts from "./charts";
import { Book } from "@/types/books";
import { useState } from "react";

type DrawerChartsProps = {
  books: Book[];
};

const DrawerCharts = ({ books }: DrawerChartsProps) => {
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

  return (
    <Drawer>
      <DrawerTrigger>
        <Button asChild className="" variant="ghost">
          <Tooltip>
            <TooltipTrigger
              asChild
              className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer !duration-200 p-0 hover:bg-transparent active:bg-transparent"
            >
              <span>
                <BarChartIcon className="!w-6 !h-6" />
              </span>
            </TooltipTrigger>
            <TooltipContent>See statistical data</TooltipContent>
          </Tooltip>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-[90%] w-full overflow-y-auto pb-12">
          <DrawerHeader>
            <DrawerTitle>My BookShelf Stats</DrawerTitle>
            <DrawerDescription>
              Track reading progress: month by month, year by year.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mt-12 md:mt-16 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col justify-center items-center gap-8">
              <div className="grid grid-cols-2 md:grid-cols-4 md justify-items-center items-center gap-8">
                <p className="text-center">
                  total of <br />
                  <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                    {books.length}
                  </span>
                  <br /> books
                </p>
                <p className="text-center">
                  <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                    {totalPagesRead}
                  </span>
                  <br /> pages <br /> read
                </p>
                <p className="text-center">
                  about <br />
                  <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                    {timeReading}h
                  </span>
                  <br /> reading
                </p>
                <p className="text-center">
                  R$ <br />
                  <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                    {totalSpent}
                  </span>
                  <br /> total
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 md justify-items-center items-center gap-8">
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
            </div>
            <div className="max-w-[70%] md:max-w-120 mt-6 mb-12 gap-2 flex flex-col justify-center items-center">
              <p className="text-center text-sm mb-4">
                If you read just <strong>{minutesPerDay}</strong> minutes a day,
                at an average pace of <strong>{minutesPerPage}</strong> minutes
                per page, in one year you'll finish over{" "}
                <strong>{annualPageGoal}</strong> pages — about{" "}
                <strong>{annualBooksGoal}</strong> books of{" "}
                <strong>{Math.round(pagesAvgThisYear)}</strong> pages each!
              </p>
              <div className="w-full flex justify-between items-baseline gap-8">
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
              <DropdownMenuTrigger className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] group flex-row gap-2 border border-[var(--medium-slate)] rounded px-2 py-1 flex justify-between items-center !duration-200">
                <span>Show by nº of</span>
                <ChevronDownIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
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
            <div className="flex justify-center items-center flex-wrap gap-8">
              <p className="text-center">
                Best Year <br />
                <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                  {bestYear.name}
                </span>
                <br /> ({bestYear.value}{" "}
                {showBy === "Books" ? "reads" : "pages"})
              </p>
              <p className="text-center">
                Best Month <br />
                <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                  {bestMonth.name}
                </span>
                <br /> ({bestMonth.value}{" "}
                {showBy === "Books" ? "reads" : "pages"})
              </p>
            </div>
            <Charts
              type="bar"
              dataChart={booksByYear}
              label="Books per Year"
              colors={["#006AB3"]}
              showBy={showBy}
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] group flex-row gap-2 border border-[var(--medium-slate)] rounded px-2 py-1 flex justify-between items-center !duration-200">
                <span>{selectedYear}</span>
                <ChevronDownIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allYears.map((y) => (
                  <DropdownMenuItem key={y} onSelect={() => setSelectedYear(y)}>
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Charts
              type="bar"
              dataChart={booksByMonth}
              label={"Books per Month (" + new Date().getFullYear() + ")"}
              colors={["#E63431"]}
              showBy={showBy}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default DrawerCharts;
