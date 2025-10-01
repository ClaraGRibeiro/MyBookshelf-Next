"use client";

// components shadcn
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
// components
import { Book } from "@/types/books";

type LinkActionProps = {
  bookLink: Book["link"];
};

const LinkAction = ({ bookLink }: LinkActionProps) => {
  return (
    <Button variant="own">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={bookLink ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-content"
          >
            <OpenInNewWindowIcon className="!w-5 !h-5" />
          </a>
        </TooltipTrigger>
        <TooltipContent>Open purchase link</TooltipContent>
      </Tooltip>
    </Button>
  );
};

export default LinkAction;
