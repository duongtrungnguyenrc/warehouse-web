import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Filter } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn";

export const FilterDropdown = <T,>({
  sortConfig,
  onSort,
  columns,
  onColumnToggle,
}: {
  sortConfig: SortConfig<T>;
  onSort: (field: keyof T) => void;
  columns: ColumnConfig<T>[];
  onColumnToggle: (key: keyof T) => void;
}) => {
  const getSortIcon = (field: keyof T) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

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
        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter((col) => col.sortable)
          .map((column) => (
            <DropdownMenuItem key={String(column.key)} onClick={() => onSort(column.key)} className="flex items-center justify-between">
              <span>Sort by {column.label}</span>
              {getSortIcon(column.key)}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem key={String(column.key)} checked={column.visible} onCheckedChange={() => onColumnToggle(column.key)}>
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
