import { AlertCircle, Eye, MapPin, Plus } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CreateWarehouseDialog, UpdateWarehouseDialog, WarehouseDetailDialog } from "@/components";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

export const WarehousesPage = () => {
  const { data } = useListing({
    fetcher: WarehouseService.list,
    initialQuery: {
      page: 0,
      limit: 20,
    },
  });

  const warehouses = (data?.data ?? []).map((w) => ({ ...w, used: 0 }));

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

  const getUsagePercentage = (used: number, capacity: number) => {
    return Math.round((used / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">Manage all warehouse information in the system</p>
        </div>

        <CreateWarehouseDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Warehouse
          </Button>
        </CreateWarehouseDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const usagePercentage = getUsagePercentage(warehouse.used, warehouse.capacity);

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
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {warehouse.address}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used capacity</span>
                    <span className="font-medium">{usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {warehouse.used} / {warehouse.capacity} m³
                    </span>
                    {usagePercentage > 90 && (
                      <span className="text-red-500 flex items-center">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Almost full
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Manager</div>
                    <div className="text-sm font-medium">{warehouse.manager.fullName}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Warehouse Type</div>
                    <div className="text-sm font-medium">{warehouse.type}</div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <WarehouseDetailDialog warehouse={warehouse}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </WarehouseDetailDialog>

                  <UpdateWarehouseDialog warehouse={warehouse} onUpdate={() => console.log("Update warehouse", warehouse.id)}>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </UpdateWarehouseDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
