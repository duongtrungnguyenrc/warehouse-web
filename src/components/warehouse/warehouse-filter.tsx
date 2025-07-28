"use client";

import { ChevronDown, Filter, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { WarehouseStatusSelect, WarehouseTypeSelect } from "@/components";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, Input } from "@/components/shadcn";

interface WarehouseFiltersProps {
  filters: WarehouseFilter;
  onFiltersChange: (filters: WarehouseFilter) => void;
  onClearFilters: () => void;
}

export function WarehouseFilters({ filters, onFiltersChange, onClearFilters }: WarehouseFiltersProps) {
  const [localFilters, setLocalFilters] = useState<WarehouseFilter>(filters);

  const handleApplyFilters = useDebouncedCallback(() => {
    onFiltersChange(localFilters);
  }, 400);

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const handleInputChange = (key: keyof WarehouseFilter, value: string | undefined) => {
    setLocalFilters({ ...localFilters, [key]: value });
    handleApplyFilters();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search warehouses by name..."
          className="pl-10 bg-white"
          value={localFilters.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          onBlur={handleApplyFilters}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 space-y-4 p-4" align="end">
          <div className="space-y-2">
            <DropdownMenuLabel>Warehouse Type</DropdownMenuLabel>
            <WarehouseTypeSelect value={localFilters.type} handleChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("type", e.target.value || undefined)} />
          </div>

          <div className="space-y-2">
            <DropdownMenuLabel>Warehouse Status</DropdownMenuLabel>
            <WarehouseStatusSelect value={localFilters.status} handleChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("status", e.target.value || undefined)} />
          </div>

          <Button className="w-full" onClick={handleClearFilters}>
            Clear
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
