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
// icons radix
import { BarChartIcon } from "@radix-ui/react-icons";
// components
import Charts from "./charts";
import { Book } from "@/types/books";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

type DrawerChartsProps = {
  books: Book[];
};

export function DrawerCharts({ books }: DrawerChartsProps) {
  const totalSpent = books.reduce((acc, b) => acc + (b.price || 0), 0);
  const numBooksRead = books.filter((b) => b.status === "Read").length;
  const yearNow = new Date().getFullYear();
  const monthNow = new Date().getMonth() + 1;
  const readingsY = books.filter(
    (b) => b.readDate?.split("/")[2] === yearNow.toString(),
  ).length;
  const readingsM = books.filter(
    (b) =>
      b.readDate?.split("/")[2] === yearNow.toString() &&
      Number(b.readDate.split("/")[1]) === monthNow,
  ).length;
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
    return {
      name: m,
      value: books.filter(
        (b) =>
          b.readDate?.split("/")[2] === yearNow.toString() &&
          Number(b.readDate.split("/")[1]) === i + 1,
      ).length,
    };
  });
  const years = Array.from(
    new Set(
      books
        .filter((b) => b.readDate)
        .map((b) => Number(b.readDate?.split("/")[2])),
    ),
  ).sort((x, y) => x - y);
  const booksByYear = years.map((y, i) => {
    return {
      name: y.toString(),
      value: books.filter((b) => Number(b.readDate?.split("/")[2]) === y)
        .length,
    };
  });

  return (
    <Drawer>
      <DrawerTrigger>
        <Button asChild className="" variant="ghost">
          <Tooltip>
            <TooltipTrigger
              asChild
              className="opacity-50 hover:opacity-100 active:opacity-100 z-2 cursor-pointer duration-200 p-0 hover:bg-transparent active:bg-transparent"
            >
              <span>
                <BarChartIcon className="!w-6 !h-6" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-[var(--dark-slate)] text-[var(--light-slate)] p-2 rounded">
              See statistical data
            </TooltipContent>
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
          <div className="mt-12 md:mt-16 flex flex-col gap-12 items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 justify-items-center items-center mb-2">
              <p className="text-center font-bold text-3xl">
                <span className="bg-gradient-to-r from-[var(--dark-blue)] via-[var(--dark-red)] to-[var(--dark-yellow)] bg-clip-text text-transparent">
                  R$ <br /> {totalSpent} <br /> total
                </span>
              </p>
              <Charts
                type="pie"
                value={numBooksRead}
                total={books.length}
                label="Readings"
                colors={["#006AB3", "#cad5e2"]}
              />
              <Charts
                type="pie"
                value={readingsY}
                total={numBooksRead}
                label={"In " + yearNow}
                colors={["#E63431", "#cad5e2"]}
              />
              <Charts
                type="pie"
                value={readingsM}
                total={readingsY}
                label={
                  "In " + new Date().toLocaleString("en-US", { month: "long" })
                }
                colors={["#FBAC0F", "#cad5e2"]}
              />
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
}
