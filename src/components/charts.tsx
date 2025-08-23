"use client";

// components shadcn
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  TooltipProps,
  XAxis,
} from "recharts";
import { Label, Pie, PieChart } from "recharts";
// components
import { Book } from "@/types/books";

type ChartsProps = {
  type: "pie" | "bar";
  dataChart?: { name: string; value: number; books: Book[] }[];
  value?: number;
  total?: number;
  label: string;
  colors: string[];
};

const Charts = ({
  type,
  dataChart,
  value,
  total,
  label,
  colors,
}: ChartsProps) => {
  function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
    if (active && payload && payload.length > 0) {
      const books: Book[] = payload[0].payload.books;
      const totalPages = books.reduce((acc, b) => acc + (b.pages || 0), 0);
      return (
        <div className="bg-[var(--light-slate)] border rounded-lg p-2 shadow-md max-w-42">
          <p className="font-bold mb-1">
            {label} {books.length > 0 && "~ " + totalPages + " pages"}
          </p>
          {books.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center items-center">
              {books.map((b, id) => (
                <div
                  key={id}
                  className={
                    "w-8 aspect-[2/3] relative hover:scale-110 active:scale-110 duration-200 cursor-pointer group"
                  }
                >
                  <img
                    className="w-full h-full object-cover"
                    src={b.image || "nobookcover.png"}
                    alt={b.title}
                    title={b.status + " ~ " + b.title}
                  />
                  {!b.image && (
                    <span className="absolute transform top-1/3 -translate-y-1/4 right-0 -translate-x-1 text-center line-clamp-2 w-[75%] max-h-[90%] select-none text-[0.5rem] break-words text-[var(--light-slate)]">
                      {b.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No books</p>
          )}
        </div>
      );
    }
    return null;
  }

  if (type === "pie") {
    const chartData = [
      { name: "Readings", value, fill: colors[0], label: "Readings" },
      {
        name: "Remaining",
        value: value && total ? total - value : 0,
        fill: colors[1],
        label: "Remaining",
      },
    ];
    return (
      <ChartContainer config={{}} className="mx-auto aspect-square h-32 w-32">
        <PieChart width={200} height={200}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={60}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="text-3xl"
                        fill={colors[0]}
                      >
                        {value && total
                          ? `${((value * 100) / total).toFixed(0)}%`
                          : "0%"}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-[var(--dark-slate)]"
                      >
                        {label}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 30}
                        className="fill-[var(--medium-slate)]"
                      >
                        {value}/{total}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  }
  if (type === "bar") {
    return (
      <ChartContainer
        config={{ value: { label: "Books" } }}
        className="w-[90%] md:w-[75%] h-64"
      >
        <BarChart
          accessibilityLayer
          data={dataChart}
          margin={{ top: 36 }}
          barCategoryGap={4}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="value" fill={colors[0]} radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-[var(--dark-slate)] text-lg"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    );
  }
};

export default Charts;
