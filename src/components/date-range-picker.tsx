import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 0, 27),
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return "Pick a date range";
    }

    if (!dateRange.to) {
      return dateRange.from.toLocaleDateString();
    }

    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);

              if (newDate?.from && newDate?.to) {
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
