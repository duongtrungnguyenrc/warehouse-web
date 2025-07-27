import { AlertCircle, Edit, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { UpdateWarehouseDialog } from "@/components/update-warehouse-dialog";
import { catchError, WAREHOUSE_TYPE } from "@/lib";
import { WarehouseService } from "@/services";
import Link from "next/link";

type WarehouseCardProps = {
  warehouse: Warehouse;
  onUpdated: (warehouse: Warehouse) => void;
  onDeleted: (id: string) => void;
};

export const WarehouseCard = ({ warehouse, onUpdated, onDeleted }: WarehouseCardProps) => {
  const handleDeleteWarehouse = async (id: string) =>
    toast.promise(WarehouseService.del(id), {
      success: () => {
        onDeleted(id);
        return `Warehouse ${warehouse.name} deleted success!`;
      },
      error: (e) => catchError(e),
      loading: `Deleting ${warehouse.name} warehouse`,
    });

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

  return (
    <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="h-[80px]">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{warehouse.name}</CardTitle>
            <CardDescription className="text-sm flex">{warehouse.address}</CardDescription>
          </div>
          <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <div className="text-xs text-muted-foreground">Manager</div>
            <div className="text-sm font-medium truncate">{warehouse.managerUser || "-"}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Type</div>
            <div className="text-sm font-medium">{WAREHOUSE_TYPE[warehouse.type]}</div>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Link className="flex-1" href={warehouse.slug}>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>

          <UpdateWarehouseDialog warehouse={warehouse} onUpdatedSuccess={onUpdated}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </UpdateWarehouseDialog>

          <ConfirmDialog onConfirm={() => handleDeleteWarehouse(warehouse.id)} title="Close Warehouse" itemName={warehouse.name}>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4" />
            </Button>
          </ConfirmDialog>
        </div>
      </CardContent>
    </Card>
  );
};
