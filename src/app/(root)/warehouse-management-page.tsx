"use client";

import { Plus } from "lucide-react";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button, WarehouseFilters } from "@/components";
import { WarehouseCard } from "@/components";
import { CreateWarehouseDialog } from "@/components/create-warehouse-dialog";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

export const WarehouseCardSkeleton = () => (
  <div className="animate-pulse rounded-lg border bg-white p-4 shadow-sm space-y-4">
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
    <div className="h-3 w-1/3 bg-gray-200 rounded" />
    <div className="h-4 w-4/5 bg-gray-200 rounded mt-2" />
    <div className="h-2 bg-gray-200 rounded w-full" />
    <div className="h-2 bg-gray-200 rounded w-2/3" />
    <div className="flex space-x-2 pt-2">
      <div className="h-8 w-full bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  </div>
);

export const WarehouseManagementPage = () => {
  const { data, query, loading, error, update, remove, append, setQuery } = useListing({
    fetcher: WarehouseService.list,
    initialQuery: {
      page: 0,
      size: 20,
    },
  });

  const warehouses = data?.content ?? [];

  const handleFiltersChange = useDebouncedCallback((filter: WarehouseFilter) => {
    setQuery(filter);
  }, 500);

  const handleClearFilters = () => {
    setQuery({});
  };

  const handleUpdateWarehouse = useCallback(
    (updatedWarehouse: Warehouse) =>
      update(
        (w) => w.id === updatedWarehouse.id,
        () => updatedWarehouse,
      ),
    [update],
  );

  const handleDeleteWarehouse = useCallback(async (deletedId: string) => remove((w) => w.id === deletedId), [remove]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Warehouse Management</h1>
            <p className="text-muted-foreground">Manage all warehouse information in the system</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4" />
            Add Warehouse
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <WarehouseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading warehouses: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">Manage all warehouse information in the system</p>
        </div>

        <CreateWarehouseDialog onSuccess={append}>
          <Button>
            <Plus className="h-4 w-4" />
            Add Warehouse
          </Button>
        </CreateWarehouseDialog>
      </div>

      <WarehouseFilters filters={query as any} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {warehouses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No warehouses found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => {
            return <WarehouseCard key={warehouse.id} warehouse={warehouse} onUpdated={handleUpdateWarehouse} onDeleted={handleDeleteWarehouse} />;
          })}
        </div>
      )}
    </div>
  );
};
