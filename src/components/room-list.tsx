import { ChevronRight, Grid3X3, Package } from "lucide-react";
import { useCallback } from "react";

import { ImportDialog } from "@/components/import-dialog.tsx";
import { RoleProtect } from "@/components/role-protect.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface RoomsListProps {
  warehouseSlug: string;
  onRoomSelect: (room: Room) => void;
}

export function RoomsList({ warehouseSlug, onRoomSelect }: RoomsListProps) {
  const { data, loading, append } = useListing({
    fetcher: WarehouseService.getManagingWarehouseRooms,
    initialQuery: {
      page: 0,
      size: 20,
      slug: warehouseSlug,
    },
  });

  const rooms = data?.content || [];

  const onImportRooms = useCallback(async (file: File) => WarehouseService.importRooms(warehouseSlug, "", file), []);

  const onImportSuccess = (newRooms: Array<Room>) => append(...newRooms);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Room List
            </CardTitle>
            <CardDescription>Manage rooms inside the warehouse</CardDescription>
          </div>
          <RoleProtect role={["ADMIN"]}>
            <ImportDialog onUpload={onImportRooms} onSuccess={onImportSuccess} />
          </RoleProtect>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : rooms.map((room) => {
                const used = room.usedCapacity || 0;
                const total = room.maxCapacity || 1;
                const usagePercentage = Math.round((used / total) * 100);

                return (
                  <Card key={room.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={() => onRoomSelect(room)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{room.name}</h4>
                          <p className="text-sm text-gray-500">{room.storageType.name}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Space usage</span>
                          <span className="font-medium">{usagePercentage}%</span>
                        </div>
                        <Progress value={usagePercentage} className="h-2" />
                        <div className="text-xs text-gray-500">
                          {used.toLocaleString()} / {total.toLocaleString()} m³
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1 text-blue-500" />
                          <div className="flex items-center gap-x-1">
                            <div className="font-medium text-xs">{room.rackCount || 0}</div>
                            <div className="text-xs text-gray-500">Racks</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t">Environment: {room.envSettings || "Standard"}</div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {!loading && rooms.length === 0 && <div className="text-center py-8 text-gray-500">No matching room found</div>}
      </CardContent>
    </Card>
  );
}
