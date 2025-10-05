import { Book } from "@/types/books";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type FilterProps = {
  value: Book["status"] | Book["ownership"] | Book["mode"] | null;
  onChange: (
    key: Book["status"] | Book["ownership"] | Book["mode"] | null,
  ) => void;
};

export default function Filter({ value, onChange }: FilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer group text-(--medium-slate) hover:text-(--dark-slate) active:text-(--dark-slate) hover:border-(--dark-slate) active:border-(--dark-slate) group flex-row gap-2 border border-(--medium-slate) rounded px-2 py-1 flex justify-between items-center !duration-200">
        <span>Filter by</span>
        <ChevronDown
          strokeWidth={1.5}
          className="sm-icon inline group-hover:scale-130 group-active:scale-130 duration-200"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onChange("Unread")}>
          Unread
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Read")}>
          Read
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onChange("Owned")}>
          Owned
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Borrowed")}>
          Borrowed
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onChange("Physical")}>
          Physical
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Digital")}>
          Digital
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onChange(null)}>All</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
