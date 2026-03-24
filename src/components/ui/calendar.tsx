"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const defaultStartMonth = () => new Date(1940, 0);
const defaultEndMonth = () =>
  new Date(new Date().getFullYear() + 15, 11);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown-years",
  startMonth: startMonthProp,
  endMonth: endMonthProp,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const startMonth = startMonthProp ?? defaultStartMonth();
  const endMonth = endMonthProp ?? defaultEndMonth();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col gap-2", defaultClassNames.months),
        month: cn(
          "grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-x-2 gap-y-4",
          "[&>*:nth-child(1)]:col-start-1 [&>*:nth-child(1)]:row-start-1",
          "[&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:row-start-1 [&>*:nth-child(2)]:justify-self-center",
          "[&>*:nth-child(3)]:col-start-3 [&>*:nth-child(3)]:row-start-1 [&>*:nth-child(3)]:justify-self-end",
          "[&>*:nth-child(4)]:col-span-3 [&>*:nth-child(4)]:row-start-2",
          defaultClassNames.month,
        ),
        month_caption: cn(
          "flex flex-wrap items-center justify-center gap-2 pt-1",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "pointer-events-none inline-flex flex-row items-center justify-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#092A31]",
          defaultClassNames.caption_label,
        ),
        dropdowns: cn(
          "flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[#092A31]",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          defaultClassNames.dropdown_root,
        ),
        /* Must stay position:absolute — do not add relative on years/months_dropdown (same node as .dropdown). */
        dropdown: cn(
          "absolute inset-0 z-20 m-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 opacity-0",
          defaultClassNames.dropdown,
        ),
        months_dropdown: cn(
          "h-full w-full min-w-0 max-w-[160px] text-sm text-[#092A31]",
          defaultClassNames.months_dropdown,
        ),
        years_dropdown: cn(
          "h-full w-full min-w-0 text-sm text-[#092A31]",
          defaultClassNames.years_dropdown,
        ),
        nav: cn("hidden", defaultClassNames.nav),
        button_previous: cn(
          "z-10 h-8 w-8 shrink-0 p-0 opacity-70 hover:opacity-100 rounded-md",
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "z-10 h-8 w-8 shrink-0 p-0 opacity-70 hover:opacity-100 rounded-md",
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          defaultClassNames.button_next,
        ),
        month_grid: cn("w-full border-collapse space-y-1", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-[#64748B] rounded-md w-8 font-normal text-[0.8rem]",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          defaultClassNames.day,
        ),
        day_button: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md",
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          defaultClassNames.day_button,
        ),
        selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          defaultClassNames.selected,
        ),
        today: cn("bg-accent text-accent-foreground", defaultClassNames.today),
        outside: cn(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
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
