"use client";

import { ChevronRight, Layers } from "lucide-react";
import { useCallback } from "react";

import { ImportDialog, Pagination, RoleProtect } from "@/components";
import { RoomTypeManagement } from "@/components/room-type-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface RoomDetailProps {
  room: Room;
  onRackSelect: (rack: Rack) => void;
}

export function RoomDetail({ room, onRackSelect }: RoomDetailProps) {
  const { data, loading, query, append, setQuery } = useListing({
    fetcher: WarehouseService.getManagingWarehouseRacks,
    initialQuery: {
      page: 0,
      size: 20,
      roomId: room.id,
    },
  });

  const racks = data?.content || [];
  const usedCapacity = room.usedCapacity || 0;
  const maxCapacity = room.totalCapacity || 1;
  const usagePercentage = maxCapacity === 0 ? 0 : Math.round((usedCapacity / maxCapacity) * 100);

  const onImportRacks = useCallback(async (file: File) => WarehouseService.importRacks(room.id, file), []);
  const onImportSuccess = (newRacks: Array<Rack>) => append(...newRacks);

  const onPageChange = (page: number) => setQuery({ page });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Room Information</CardTitle>
              <RoleProtect role={["ADMIN"]}>
                <RoomTypeManagement />
              </RoleProtect>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Room Name</label>
                <p className="font-semibold">{room.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Storage Type</label>
                <p>{room.storageType.name}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Environment</label>
              <p>{room.envSettings}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Number of Racks</label>
              <p className="text-lg font-semibold">{racks.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{usagePercentage}%</div>
              <p className="text-sm text-gray-500">Used</p>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Used:</span>
                <span className="font-medium">{usedCapacity.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{(maxCapacity - usedCapacity).toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{maxCapacity.toFixed(2)} m³</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Rack List
              </CardTitle>
              <CardDescription>Racks stored in the room</CardDescription>
            </div>
            <RoleProtect role={["ADMIN"]}>
              <ImportDialog onUpload={onImportRacks} onSuccess={onImportSuccess} />
            </RoleProtect>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : racks.map((rack) => {
                  const rackUsagePercentage = Math.round((rack.usedSize / rack.maxSize) * 100);
                  return (
                    <Card key={rack.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex flex-col" onClick={() => onRackSelect(rack)}>
                      <CardHeader className="pb-3 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{rack.id}</h4>
                            <p className="text-sm text-gray-500">Position: {rack.slotNumber}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span className="font-medium">{rackUsagePercentage.toFixed(2)}%</span>
                          </div>
                          <Progress value={rackUsagePercentage} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {rack.usedSize.toFixed(2)} / {rack.maxSize.toFixed(2)} m³
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
                          <div>
                            <div className="font-medium">{rack.details.equipments?.length}</div>
                            <div className="text-xs text-gray-500">Equipments</div>
                          </div>
                          <div>
                            <div className="font-medium">{rack.levelNumber}</div>
                            <div className="text-xs text-gray-500">Level</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>

          <div className="flex justify-center mt-5">
            <Pagination currentPage={query.page} onChangePage={onPageChange} pageCount={data?.totalPages ?? 1} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
