"use client";

import { Book } from "@/types/books";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type LinkProps = {
  bookLink: Book["link"];
};

export default function Link({ bookLink }: LinkProps) {
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
}
