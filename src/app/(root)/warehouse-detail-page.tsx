"use client";

import { ArrowLeft, Package, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";

import { EquipmentDetail, RoleProtect, RoomTypeManagementDialog } from "@/components";
import { RackDetail } from "@/components";
import { RoomDetail } from "@/components";
import { RoomsList } from "@/components";
import { Badge } from "@/components/shadcn/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useQuery } from "@/hooks";
import { toastOnError } from "@/lib";
import { WarehouseService } from "@/services";

type ViewLevel = "warehouse" | "room" | "rack" | "equipment";

interface NavigationState {
  level: ViewLevel;
  selectedRoom?: Room;
  selectedRack?: Rack;
  selectedEquipment?: Equipment;
}

type WarehouseDetailPageProps = {
  slug?: string;
};

export const WarehouseDetailPage = ({ slug }: WarehouseDetailPageProps) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    level: "warehouse",
  });

  const { result: warehouse, call, loading } = useQuery(WarehouseService.getManaging);

  useEffect(() => {
    call(slug).catch(toastOnError);
  }, [call]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "active":
        return "bg-green-50 text-green-700";
      case "MAINTENANCE":
      case "maintenance":
        return "bg-yellow-50 text-yellow-700";
      case "CLOSED":
      case "inactive":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "active":
        return "Active";
      case "MAINTENANCE":
      case "maintenance":
        return "Maintenance";
      case "CLOSED":
        return "Closed";
      case "inactive":
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const handleNavigate = (newNavigation: Partial<NavigationState>) => {
    setNavigation((prev) => ({ ...prev, ...newNavigation }));
  };

  const handleBack = () => {
    switch (navigation.level) {
      case "equipment":
        setNavigation((prev) => ({
          ...prev,
          level: "rack",
          selectedEquipment: undefined,
        }));
        break;
      case "rack":
        setNavigation((prev) => ({
          ...prev,
          level: "room",
          selectedRack: undefined,
        }));
        break;
      case "room":
        setNavigation((prev) => ({
          ...prev,
          level: "warehouse",
          selectedRoom: undefined,
        }));
        break;
    }
  };

  const renderBreadcrumb = () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => setNavigation({ level: "warehouse" })} className="cursor-pointer">
            <Warehouse className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => setNavigation({ level: "warehouse" })} className="cursor-pointer">
            {warehouse?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {navigation.selectedRoom && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {navigation.level === "room" ? (
                <BreadcrumbPage>{navigation.selectedRoom.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink onClick={() => handleNavigate({ level: "room" })} className="cursor-pointer">
                  {navigation.selectedRoom.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {navigation.selectedRack && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {navigation.level === "rack" ? (
                <BreadcrumbPage>Rack {navigation.selectedRack.slotNumber}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink onClick={() => handleNavigate({ level: "rack" })} className="cursor-pointer">
                  {navigation.selectedRack.slotNumber}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {navigation.selectedEquipment && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{navigation.selectedEquipment.lpn}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (loading || !warehouse) {
    return (
      <div className="py-8 space-y-4 mx-auto">
        <div className="flex items-center space-x-2">
          <Package className="h-10 w-10" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-5 w-60" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-72 w-full md:col-span-2" />
          <Skeleton className="h-72 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="h-10 w-10" />
              <span className="text-3xl font-bold">{warehouse.name}</span>
              <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
            </div>
            <p className="text-gray-500 mt-2">Manage warehouse and equipment</p>
          </div>

          {navigation.level !== "warehouse" && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
        </div>

        <div className="mt-4">{renderBreadcrumb()}</div>
      </div>

      <div className="space-y-6">
        {navigation.level === "warehouse" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Warehouse Information</CardTitle>
                    <RoleProtect role={["ADMIN"]}>
                      <RoomTypeManagementDialog />
                    </RoleProtect>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Warehouse Name</label>
                      <p>{warehouse.name}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p>{warehouse.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Area</label>
                      <p>{warehouse.areaSize?.toLocaleString()} m²</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Manager</label>
                      <p>{warehouse.managerUser || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{warehouse.usagePercentage.toFixed(2)}%</div>
                    <p className="text-sm text-gray-500">Used</p>
                  </div>
                  <Progress value={warehouse.usagePercentage} className="h-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span className="font-medium">{warehouse.usedCapacity?.toLocaleString()} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-medium">{(warehouse.totalCapacity - warehouse.usedCapacity).toLocaleString()} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{warehouse.totalCapacity?.toLocaleString()} m³</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <RoomsList warehouseId={warehouse.id} warehouseSlug={slug || ""} onRoomSelect={(room: Room) => handleNavigate({ level: "room", selectedRoom: room })} />

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
                    <p className="text-sm text-gray-600">{warehouse.createdByUser || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {navigation.level === "room" && navigation.selectedRoom && (
          <RoomDetail room={navigation.selectedRoom} onRackSelect={(rack) => handleNavigate({ level: "rack", selectedRack: rack })} />
        )}

        {navigation.level === "rack" && navigation.selectedRack && (
          <RackDetail
            rack={navigation.selectedRack}
            onEquipmentSelect={(equipment) =>
              handleNavigate({
                level: "equipment",
                selectedEquipment: equipment,
              })
            }
          />
        )}

        {navigation.level === "equipment" && navigation.selectedEquipment && <EquipmentDetail equipment={navigation.selectedEquipment} />}
      </div>
    </div>
  );
};
