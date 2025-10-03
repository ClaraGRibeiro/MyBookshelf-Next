import { Book } from "@/types/books";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type SortProps = {
  value: keyof Book;
  onChange: (key: keyof Book) => void;
  type: keyof Book;
};
export default function Sort({ value, onChange, type }: SortProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          onClick={() => onChange(type)}
          className="cursor-pointer !duration-200 group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] group sm:max-w-36 flex items-center flex-row gap-1 w-fit"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
          <CaretSortIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Sort by {type.charAt(0).toUpperCase() + type.slice(1)}
      </TooltipContent>
    </Tooltip>
  );
}
