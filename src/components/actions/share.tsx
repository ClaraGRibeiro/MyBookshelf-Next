"use client";

import html2canvas from "html2canvas-pro";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ShareProps = {
  screen: string;
  lightBg?: boolean;
};

export default function Share({ screen, lightBg = false }: ShareProps) {
  const handleShare = async () => {
    const downloadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const element = document.getElementById(screen);
        if (!element) {
          return reject(new Error("Could not find the element."));
        }
        const specialTextElements = element?.querySelectorAll(".special-text");
        specialTextElements?.forEach((el) => {
          el.classList.remove("special-text");
          el.classList.add("text-(--medium-slate)", "stroke-1");
        });
        const specialGradientElements =
          element?.querySelectorAll(".special-gradient");
        specialGradientElements?.forEach((el) => {
          el.classList.remove("special-gradient");
          el.classList.add("bg-(--dark-yellow)");
        });

        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#fff3e4",
        });
        specialTextElements.forEach((el) => {
          el.classList.add("special-text");
          el.classList.remove("text-(--medium-slate)", "stroke-1");
        });
        specialGradientElements.forEach((el) => {
          el.classList.add("special-gradient");
          el.classList.remove("bg-(--dark-yellow)");
        });

        const dataUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "nextbook-mybookshelf.png";
        link.click();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
    toast.promise(downloadPromise, {
      loading: (
        <span className="text-(--medium-slate)">Generating image...</span>
      ),
      success: (
        <span className="text-(--dark-slate)">
          Image downloaded successfully!
        </span>
      ),
      error: (
        <span className="text-(--dark-red)">Failed to generate image.</span>
      ),
      icon: false,
      style: {
        backgroundColor: "#f1f5f9",
      },
    });
  };

  return (
    <Button
      variant="own"
      className={
        !lightBg
          ? "hover:!bg-(--light-slate) active:!bg-(--light-slate)"
          : "hover:!bg-(--dark-slate) active:!bg-(--dark-slate)"
      }
      onClick={handleShare}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={
                  !lightBg
                    ? "!text-(--light-slate) group-hover:!text-(--dark-slate) group-active:!text-(--dark-slate)"
                    : "!text-(--dark-slate) group-hover:!text-(--light-slate) group-active:!text-(--light-slate)" +
                      " btn-content"
                }
              >
                <Send strokeWidth={1.5} className="md-icon" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Share your current screen</TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </Dialog>
    </Button>
  );
}
