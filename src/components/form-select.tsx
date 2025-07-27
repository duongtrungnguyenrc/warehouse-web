"use client";

import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn";
import { Input } from "@/components/shadcn/input";

interface FormSelectProps {
  name: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  setFieldValue: (field: string, value: any) => void;
  value?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
}

export const FormSelect = ({ name, placeholder, options, setFieldValue, value, onScrollEnd, loading = false }: FormSelectProps) => {
  const [search, setSearch] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      onScrollEnd?.();
    }
  };

  return (
    <Select onValueChange={(val) => setFieldValue(name, val)} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent ref={contentRef} onScroll={handleScroll}>
        <div className="px-2 py-1 sticky top-0 bg-background z-10">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8" />
        </div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-2 text-muted-foreground text-sm">No results</div>
        )}
        {loading && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
