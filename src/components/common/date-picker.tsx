"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

type DatePickerProps = {
  placeholder?: string;
  value?: string | Date;
  name: string;
  setFieldValue?: (field: string, value: any) => void;
};

export const DatePicker = ({ name, value, placeholder, setFieldValue }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const dateValue = value ? new Date(value) : undefined;

  const handleChange = (date: Date | undefined) => {
    setFieldValue?.(name, date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date" className="justify-between font-normal w-full">
          {dateValue ? dateValue.toLocaleDateString() : placeholder}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full overflow-hidden p-0" align="start">
        <Calendar mode="single" selected={dateValue} captionLayout="dropdown" onSelect={handleChange} />
      </PopoverContent>
    </Popover>
  );
};
