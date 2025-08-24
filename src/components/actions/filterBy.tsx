// components shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// icons radix
import { ChevronDownIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";

type FilterByProps = {
  value: Book["status"] | null;
  onChange: (status: Book["status"] | null) => void;
};

const FilterBy = ({ value, onChange }: FilterByProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer group text-[var(--medium-slate)] hover:text-[var(--dark-slate)] active:text-[var(--dark-slate)] hover:border-[var(--dark-slate)] active:border-[var(--dark-slate)] group flex-row gap-2 border border-[var(--medium-slate)] rounded px-2 py-1 flex justify-between items-center !duration-200">
        <span>Filter by</span>
        <ChevronDownIcon className="inline group-hover:scale-130 group-active:scale-130 duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onChange("Unread")}>
          Unread
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Reading")}>
          Reading
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Read")}>
          Read
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange(null)}>All</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterBy;
