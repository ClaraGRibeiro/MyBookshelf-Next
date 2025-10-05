"use client";

import html2canvas from "html2canvas-pro";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Share() {
  const handleShare = async () => {
    const element = document.getElementById("share-image");
    if (!element) {
      toast("❌ Error", {
        description: "Could not find the element.",
      });
      return;
    }

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fff3e4",
    });

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "nextbook-mybookshelf.png";
    link.click();
    toast("✅ Success", {
      description: "Your book collection image was saved!",
    });
  };

  return (
    <Button
      variant="own"
      className="hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)]"
      onClick={handleShare}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] group-active:!text-[var(--dark-slate)] btn-content">
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
