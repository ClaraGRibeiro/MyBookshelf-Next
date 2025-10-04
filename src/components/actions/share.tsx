"use client";

import { Book } from "@/types/books";
import { Share1Icon } from "@radix-ui/react-icons";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ShareProps = {
  books: Book[];
};

export default function Share({ books }: ShareProps) {
  const booksRead = books.filter((b) => b.status === "Read");
  const handleShare = async () => {
    const element = document.createElement("div");
    element.classList.add(
      "grid",
      "p-6",
      "grid-cols-6",
      "gap-6",
      "justify-items-center",
      "content-start",
      "bg-[#fff3e4]",
    );

    element.innerHTML = `
    <h2 style="
  grid-column: span 6;
  font-size: 26pt;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #1d293d;
  ">My Readings</h2>
    ${booksRead
      .map(
        (b) => `
      <div style="
      display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
        ">
        <div style="
        aspect-ratio:2/3;
            width:100%;
            overflow:hidden;
            ">
            <img
              crossOrigin="anonymous"
              src="${b.image}"
              alt="${b.title}"
              style="width:100%;height:100%;object-fit:cover;"
              />
              </div>
              <span style="
              font-size:10pt;
            margin-top:6px;
            color:#0f172b;
          ">
            ${b.title}
          </span>
          </div>
          `,
      )
      .join("")}
      
`;

    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
    });
    document.body.removeChild(element);

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "my-readings.png";
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
                <Share1Icon className="!w-6 !h-6" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Share your readings</TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </Dialog>
    </Button>
  );
}
