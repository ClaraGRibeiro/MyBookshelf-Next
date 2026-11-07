import { SortKey } from "@/types/books";
import { getSortLabel } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type SortProps = {
  value: SortKey;
  onChange: (key: SortKey) => void;
  type: SortKey;
};
export default function Sort({ value, onChange, type }: SortProps) {
  const label = getSortLabel(type);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          onClick={() => onChange(type)}
          className="cursor-pointer !duration-200 group text-(--medium-slate) hover:text-(--dark-slate) active:text-(--dark-slate) group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
          <ChevronsUpDown
            strokeWidth={1.5}
            className="sm-icon inline group-hover:scale-130 group-active:scale-130 duration-200"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Sort by {label.charAt(0).toUpperCase() + label.slice(1)}
      </TooltipContent>
    </Tooltip>
  );
}
