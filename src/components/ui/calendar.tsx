"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: cn(
          "grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-x-2 gap-y-4",
          "[&>*:nth-child(1)]:col-start-1 [&>*:nth-child(1)]:row-start-1",
          "[&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:row-start-1 [&>*:nth-child(2)]:justify-self-center",
          "[&>*:nth-child(3)]:col-start-3 [&>*:nth-child(3)]:row-start-1 [&>*:nth-child(3)]:justify-self-end",
          "[&>*:nth-child(4)]:col-span-3 [&>*:nth-child(4)]:row-start-2"
        ),
        month_caption: "flex justify-center pt-1 items-center",
        caption_label: "text-sm font-medium text-[#092A31]",
        nav: "hidden",
        button_previous: cn(
          "z-10 h-8 w-8 shrink-0 p-0 opacity-70 hover:opacity-100 rounded-md",
          buttonVariants({ variant: "outline", size: "icon-sm" })
        ),
        button_next: cn(
          "z-10 h-8 w-8 shrink-0 p-0 opacity-70 hover:opacity-100 rounded-md",
          buttonVariants({ variant: "outline", size: "icon-sm" })
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-[#64748B] rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
        day_button: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md",
          buttonVariants({ variant: "ghost", size: "icon-sm" })
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
