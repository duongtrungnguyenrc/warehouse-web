"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";

type DateRangePickerProps = {
  onChange?: (range: DateRange) => void;
};

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange>(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      from: startOfMonth,
      to: now,
    };
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return "Pick a date range";
    if (!dateRange.to) return dateRange.from.toLocaleDateString();
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  };

  const isSameDate = (a?: Date, b?: Date) => a?.getTime() === b?.getTime();

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={(newDate) => {
              if (newDate?.from && newDate?.to) {
                const isSameFrom = isSameDate(date.from, newDate.from);
                const isSameTo = isSameDate(date.to, newDate.to);
                if (!isSameFrom || !isSameTo) {
                  setDate(newDate);
                  onChange?.(newDate);
                }
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
