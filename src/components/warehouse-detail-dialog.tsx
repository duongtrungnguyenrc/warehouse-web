import { Activity, Edit, Package, Pen, Plus, Trash2, Users } from "lucide-react";
import type { ReactNode } from "react";

import { ConfirmDialog } from "./confirm-dialog";
import { CreateZoneDialog } from "./create-zone-dialog";
import { UpdateZoneDialog } from "./update-zone-dialog";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Progress } from "@/components/shadcn/progress";

interface WarehouseDetailDialogProps {
  warehouse: Warehouse | null;
  children?: ReactNode;
}

export const WarehouseDetailDialog = ({ warehouse, children }: WarehouseDetailDialogProps) => {
  if (!warehouse) return null;

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-6xl min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{warehouse.name}</span>
            <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
          </DialogTitle>
          <DialogDescription>Warehouse detail and configuration</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Warehouse ID</label>
                    <p className="font-mono">{warehouse.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Warehouse Name</label>
                    <p>{warehouse.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="flex items-center">{warehouse.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Area Size</label>
                    <p>{warehouse.areaSize?.toLocaleString()} m²</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Capacity</label>
                    <p>{warehouse.usedCapacity?.toLocaleString()} m³</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Manager</label>
                  <p>{warehouse.manager}</p>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{warehouse.usagePercentage}%</div>
                  <p className="text-sm text-gray-500">Used</p>
                </div>

                <Progress value={warehouse.usagePercentage} className="h-3" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span className="font-medium">{warehouse.usedCapacity} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-medium">{(warehouse.totalCapacity - warehouse.usedCapacity).toLocaleString()} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{warehouse.usedCapacity} m³</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zones */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Warehouse Zones</CardTitle>
                  <CardDescription>List of zones inside the warehouse</CardDescription>
                </div>
                <CreateZoneDialog warehouseId={warehouse.id}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Zone
                  </Button>
                </CreateZoneDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(warehouse as any).zones?.map((zone: Zone) => (
                  <div key={zone.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="text-xs text-gray-500">{zone.storageTypeName}</p>
                      </div>
                      <div className="flex space-x-2">
                        <UpdateZoneDialog onUpdatedSuccess={(_) => {}} zone={zone}>
                          <Badge className="text-black bg-gray-50">
                            <Pen className="h-4 w-4" />
                          </Badge>
                        </UpdateZoneDialog>
                        <ConfirmDialog onConfirm={() => console.log("Delete", zone.id)} title="Delete Zone" itemName={zone.name}>
                          <Badge className="text-red-500 bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Badge>
                        </ConfirmDialog>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="block text-gray-600">Max capacity: {zone.maxCapacity.toLocaleString()} m³</span>
                      <span className="block text-gray-600">Environment: {zone.envSettings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Settings</CardTitle>
              <CardDescription>Configuration and control options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Created At</label>
                  <p className="text-sm text-gray-600">{new Date(warehouse.createAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created By</label>
                  <p className="text-sm text-gray-600">{warehouse.createdBy}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Info
                </Button>
                <Button variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </Button>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
