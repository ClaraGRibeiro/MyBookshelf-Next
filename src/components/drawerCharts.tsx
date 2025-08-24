"use client";

// components shadcn
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
// components
import Charts from "./charts";
import { Book } from "@/types/books";

type DrawerChartsProps = {
  books: Book[];
};

const DrawerCharts = ({ books }: DrawerChartsProps) => {
  const booksRead = books.filter((b) => b.status === "Read");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
  const years = Array.from(
    new Set(booksRead.map((b) => Number(b.readDate?.split("/")[2]))),
  ).sort((x, y) => x - y);
  const booksByYear = years.map((y) => {
    const b = booksRead.filter((b) => Number(b.readDate?.split("/")[2]) === y);
    return {
      name: y.toString(),
      value: b.length || 0,
      books: b,
    };
  });
  const readThisYear =
    booksByYear.find((bY) => bY.name === currentYear.toString())?.books || [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const booksByMonth = months.map((m, i) => {
    const b = readThisYear.filter(
      (b) => Number(b.readDate?.split("/")[1]) === i + 1,
    );
    return {
      name: m,
      value: b.length || 0,
      books: b || [],
    };
  });
  const readThisMonth =
    booksByMonth.find((bM) => bM.name === currentMonth)?.books || [];
  const totalSpent = books.reduce((acc, b) => acc + (b.price || 0), 0);
  const totalPagesRead = booksRead.reduce((acc, b) => acc + (b.pages || 0), 0);
  const timeRead = ((2.5 * totalPagesRead) / 60).toFixed(1);
  const bestYear = booksByYear.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    { name: "No reads", value: 0, books: [] },
  );
  const bestMonth = booksByMonth.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    { name: "No reads", value: 0, books: [] },
  );
  const pagePerDay = 12;
  const pagesAvg = totalPagesRead / booksRead.length;
  const goal = Math.round((pagePerDay * 365) / pagesAvg);
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
                    {timeRead}h
                  </span>
                  <br /> reading
                </p>
                <p className="text-center">
                  R$ <br />
                  <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                    {totalSpent.toFixed(2)}
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
                  value={readThisYear.length} //0
                  total={booksRead.length} //27
                  label={"In " + currentYear}
                  colors={["#E63431", "#cad5e2"]}
                />
                <div className="col-span-2 flex justify-center md:col-span-1 md:block">
                  <Charts
                    type="pie"
                    value={readThisMonth.length} //0
                    total={readThisYear.length} //0
                    label={
                      "In " +
                      new Date().toLocaleString("en-US", { month: "long" })
                    }
                    colors={["#FBAC0F", "#cad5e2"]}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center flex-wrap gap-8">
              <p className="text-center">
                Best Year <br />
                <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                  {bestYear.name}
                </span>
                <br /> ({bestYear.value} reads)
              </p>
              <p className="text-center">
                Best Month <br />
                <span className="font-bold text-3xl bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                  {bestMonth.name}
                </span>
                <br /> ({bestMonth.value} reads)
              </p>
            </div>
            <div className="max-w-[70%] md:max-w-120 flex flex-col justify-center items-center">
              <p className="text-center">
                Read <strong>{pagePerDay}</strong> pages a day, with an avg of{" "}
                <strong>{Math.round(pagesAvg)}</strong> pages per book, in a
                year you will have read <strong>{goal}</strong> books!
              </p>
              <div className="w-full flex justify-between gap-8">
                <span>{readThisYear.length}</span>
                <span>
                  {goal - readThisYear.length > 0
                    ? goal - readThisYear.length
                    : "🎉"}
                </span>
              </div>
              <Progress value={(readThisYear.length * 100) / goal} />
            </div>
            <Charts
              type="bar"
              dataChart={booksByYear}
              label="Books per Year"
              colors={["#E63431"]}
            />
            <Charts
              type="bar"
              dataChart={booksByMonth}
              label={"Books per Month (" + new Date().getFullYear() + ")"}
              colors={["#FBAC0F"]}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default DrawerCharts;
