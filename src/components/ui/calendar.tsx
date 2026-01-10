import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-slate-900 rounded-lg border border-slate-800", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center pb-4 border-b border-slate-700",
        caption_label: "text-sm font-semibold text-slate-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 border-slate-700 hover:border-slate-600 hover:text-slate-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mt-4",
        head_row: "flex gap-1",
        head_cell: "text-slate-400 rounded-md w-10 h-10 font-normal text-[0.75rem] flex items-center justify-center uppercase tracking-wide",
        row: "flex w-full gap-1 mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-800/30 [&:has([aria-selected])]:bg-slate-800/60 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-md text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-slate-100 text-slate-900 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 font-semibold",
        day_today: "bg-slate-800 text-slate-100 font-semibold ring-2 ring-slate-600",
        day_outside:
          "day-outside text-slate-500 opacity-40 aria-selected:bg-slate-800/30 aria-selected:text-slate-500 aria-selected:opacity-30",
        day_disabled: "text-slate-600 opacity-40",
        day_range_middle: "aria-selected:bg-slate-800 aria-selected:text-slate-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
