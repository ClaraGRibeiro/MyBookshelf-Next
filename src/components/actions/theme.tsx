"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Theme() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <Button
      variant="own"
      className="hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)]"
      onClick={toggleDarkMode}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] group-active:!text-[var(--dark-slate)] btn-content">
            {isDark ? (
              <Sun strokeWidth={1.5} className="md-icon cursor-pointer" />
            ) : (
              <Moon strokeWidth={1.5} className="md-icon cursor-pointer" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Change to {isDark ? "light" : "dark"} theme
        </TooltipContent>
      </Tooltip>
    </Button>
  );
}
