"use client";

import { Book } from "@/types/books";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ExternalLink } from "lucide-react";

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
            <ExternalLink strokeWidth={1.5} className="md-icon" />
          </a>
        </TooltipTrigger>
        <TooltipContent>Open purchase link</TooltipContent>
      </Tooltip>
    </Button>
  );
}
