"use client";

import { AlertCircle, Edit, Eye, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, WarehouseFilters } from "@/components";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreateWarehouseDialog } from "@/components/create-warehouse-dialog";
import { UpdateWarehouseDialog } from "@/components/update-warehouse-dialog";
import { WarehouseDetailDialog } from "@/components/warehouse-detail-dialog";
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

export const WarehousesPage = () => {
  const [filters, setFilters] = useState<WarehouseFilters>({});

  const { data, loading, error, refetch, update, remove, append } = useListing({
    fetcher: WarehouseService.list,
    initialQuery: {
      page: 0,
      limit: 20,
      ...filters,
    },
  });

  const warehouses = data?.content ?? [];

  const handleFiltersChange = (newFilters: WarehouseFilters) => {
    setFilters(newFilters);
    // Trigger refetch with new filters - you might want to update your useListing hook to support this
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({});
    refetch();
  };

  const handleUpdateWarehouse = (updatedWarehouse: Warehouse) => {
    update(
      (w) => w.id === updatedWarehouse.id,
      () => updatedWarehouse,
    );
  };

  const handleDeleteWarehouse = async (warehouse: Warehouse) => {
    try {
      // await WarehouseService.remove(warehouse.id);
      remove((w) => w.id === warehouse.id);
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
    }
  };

  const getStatusColor = (status: WarehouseStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700";
      case "MAINTENANCE":
        return "bg-yellow-50 text-yellow-700";
      case "CLOSED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: WarehouseStatus) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "MAINTENANCE":
        return "Maintenance";
      case "CLOSED":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const getTypeText = (type: WarehouseType) => {
    return type === "DC" ? "Distribution Center" : "Cold Storage";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Warehouse Management</h1>
            <p className="text-muted-foreground">Manage all warehouse information in the system</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add New Warehouse
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
            <Plus className="mr-2 h-4 w-4" />
            Add New Warehouse
          </Button>
        </CreateWarehouseDialog>
      </div>

      <WarehouseFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {warehouses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No warehouses found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => {
            return (
              <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                      <CardDescription className="font-mono text-sm">{warehouse.id}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground max-w-[90%] truncate">
                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{warehouse.address}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used capacity</span>
                      <span className="font-medium">{warehouse.usagePercentage?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${warehouse.usagePercentage > 90 ? "bg-red-500" : warehouse.usagePercentage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(warehouse.usagePercentage || 0, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {warehouse.usedCapacity?.toLocaleString() || 0} / {warehouse.totalCapacity?.toLocaleString() || 0} m³
                      </span>
                      {warehouse.usagePercentage > 90 && (
                        <span className="text-red-500 flex items-center">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Almost full
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Manager ID</div>
                      <div className="text-sm font-medium truncate">{warehouse.manager + ""}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Type</div>
                      <div className="text-sm font-medium">{getTypeText(warehouse.type)}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <WarehouseDetailDialog warehouse={warehouse}>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </WarehouseDetailDialog>

                    <UpdateWarehouseDialog warehouse={warehouse} onUpdate={handleUpdateWarehouse}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </UpdateWarehouseDialog>

                    <ConfirmDialog
                      onConfirm={() => handleDeleteWarehouse(warehouse)}
                      title="Delete Warehouse"
                      description={`Are you sure you want to delete warehouse "${warehouse.name}"? This action cannot be undone.`}
                      itemName={warehouse.name}
                    >
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
