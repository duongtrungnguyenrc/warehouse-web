"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Filter, Search } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn";

export interface FilterDropdownProps<T> {
  columns: ColumnConfig<T>[];
  sortConfig?: SortConfig<T>;
  onSort?: (field: keyof T) => void;
  onColumnToggle?: (key: keyof T) => void;
  searchConfig?: SearchConfig<T>;
  onSearchFieldChange?: (field: keyof T) => void;
  onSearchValueChange?: (value: string) => void;
}

export const FilterDropdown = <T,>({ columns, sortConfig, onSort, onColumnToggle, searchConfig, onSearchFieldChange }: FilterDropdownProps<T>) => {
  const getSortIcon = (field: keyof T) => {
    if (!sortConfig || sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const sortableColumns = columns.filter((col) => col.sortable);
  const searchableColumns = columns.filter((col) => col.searchable);

  const showSort = sortConfig && onSort && sortableColumns.length > 0;
  const showColumnVisibility = onColumnToggle;
  const showSearch = searchConfig && onSearchFieldChange && searchableColumns.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* Search Section */}
        {showSearch && (
          <>
            <DropdownMenuLabel className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Search Field
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={String(searchConfig.field)} onValueChange={(value) => onSearchFieldChange(value as keyof T)}>
              {searchableColumns.map((column) => (
                <DropdownMenuRadioItem key={String(column.key)} value={String(column.key)}>
                  Search by {column.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {(showSort || showColumnVisibility) && <DropdownMenuSeparator />}
          </>
        )}

        {/* Sort Section */}
        {showSort && (
          <>
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortableColumns.map((column) => (
              <DropdownMenuItem key={String(column.key)} onClick={() => onSort(column.key)} className="flex items-center justify-between">
                <span>Sort by {column.label}</span>
                {getSortIcon(column.key)}
              </DropdownMenuItem>
            ))}
            {showColumnVisibility && <DropdownMenuSeparator />}
          </>
        )}

        {/* Column Visibility Section */}
        {showColumnVisibility && (
          <>
            <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => (
              <DropdownMenuCheckboxItem key={String(column.key)} checked={column.visible} onCheckedChange={() => onColumnToggle(column.key)}>
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
