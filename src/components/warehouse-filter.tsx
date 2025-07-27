"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";

interface WarehouseFiltersProps {
  filters: WarehouseFilter;
  onFiltersChange: (filters: WarehouseFilter) => void;
  onClearFilters: () => void;
}

export function WarehouseFilters({ filters, onFiltersChange, onClearFilters }: WarehouseFiltersProps) {
  const [localFilters, setLocalFilters] = useState<any>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onClearFilters();
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== undefined && value !== "").length;
  };

  const getActiveFilterBadges = () => {
    const badges = [];

    if (filters.name) badges.push({ key: "name", label: `Name: ${filters.name}` });
    if (filters.address) badges.push({ key: "address", label: `Address: ${filters.address}` });
    if (filters.type) badges.push({ key: "type", label: `Type: ${filters.type === "DC" ? "Distribution Center" : "Cold Storage"}` });
    if (filters.status) badges.push({ key: "status", label: `Status: ${filters.status}` });
    if (filters.minAreaSize) badges.push({ key: "minAreaSize", label: `Min Area: ${filters.minAreaSize}m²` });
    if (filters.maxAreaSize) badges.push({ key: "maxAreaSize", label: `Max Area: ${filters.maxAreaSize}m²` });

    return badges;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search warehouses by name..." onChange={(e) => onFiltersChange({ ...filters, name: e.target.value })} className="pl-10 bg-white" />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-5" align="end">
            <Card className="border-0 shadow-none p-0">
              <CardHeader className="p-0">
                <CardTitle className="text-sm">Filter Warehouses</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-0">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Search by address..."
                    value={localFilters.address || ""}
                    onChange={(e) => setLocalFilters({ ...localFilters, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={localFilters.type || "ANY_TYPE"} onValueChange={(value) => setLocalFilters({ ...localFilters, type: value || undefined })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANY_TYPE">Any type</SelectItem>
                        <SelectItem value="DC">Distribution Center</SelectItem>
                        <SelectItem value="CW">Cold Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={localFilters.status || "ANY_STATUS"} onValueChange={(value) => setLocalFilters({ ...localFilters, status: value || undefined })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANY_STATUS">Any status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Area Size Range (m²)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minAreaSize || ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          minAreaSize: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxAreaSize || ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          maxAreaSize: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterBadges().length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {getActiveFilterBadges().map((badge) => (
            <Badge key={badge.key} variant="secondary" className="gap-1">
              {badge.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  const newFilters = { ...filters };
                  onFiltersChange(newFilters);
                }}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-auto p-1 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
