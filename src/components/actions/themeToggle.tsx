"use client";

// components shadcn
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function ThemeToggle() {
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
              <SunIcon className="!w-6 !h-6 cursor-pointer" />
            ) : (
              <MoonIcon className="!w-6 !h-6 cursor-pointer" />
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
