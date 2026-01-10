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
      className={cn("p-4 bg-black rounded-lg border border-gray-800", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center pb-4 border-b border-gray-800",
        caption_label: "text-sm font-semibold text-gray-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 border-gray-700 hover:border-gray-600 hover:text-gray-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mt-4",
        head_row: "flex gap-1",
        head_cell: "text-gray-500 rounded-md w-10 h-10 font-normal text-[0.75rem] flex items-center justify-center uppercase tracking-wide",
        row: "flex w-full gap-1 mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/30 [&:has([aria-selected])]:bg-gray-900/60 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-md text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black font-semibold",
        day_today: "bg-gray-900 text-gray-100 font-semibold ring-2 ring-yellow-400",
        day_outside:
          "day-outside text-gray-600 opacity-40 aria-selected:bg-gray-900/30 aria-selected:text-gray-600 aria-selected:opacity-30",
        day_disabled: "text-gray-700 opacity-40",
        day_range_middle: "aria-selected:bg-gray-900 aria-selected:text-gray-100",
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
