"use client";

import { ChevronRight, Grid3X3, Package } from "lucide-react";
import { useCallback } from "react";

import { CreateRoomDialog, ImportDialog, Pagination } from "@/components";
import { RoleProtect } from "@/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";
import { UpdateRoomDialog } from "./update-room-dialog";

interface RoomsListProps {
  warehouseId: string;
  warehouseSlug: string;
  onRoomSelect: (room: Room) => void;
}

export const RoomsList = ({ warehouseId, warehouseSlug, onRoomSelect }: RoomsListProps) => {
  const { data, loading, query, append, setQuery, update } = useListing({
    fetcher: WarehouseService.getManagingWarehouseRooms,
    initialQuery: {
      page: 0,
      size: 20,
      slug: warehouseSlug,
    },
  });

  const rooms = data?.content || [];

  const onImportRooms = useCallback(async (file: File) => WarehouseService.importRooms(warehouseSlug, "", file), []);

  const onImportSuccess = useCallback((newRooms: Array<Room>) => append(...newRooms), [append]);

  const onPageChange = (page: number) => setQuery({ page });

  const onRoomUpdatedSuccess = useCallback(
    (updatedRoom: Room) => {
      update(
        (prev) => prev.id === updatedRoom.id,
        () => updatedRoom,
      );
    },
    [update],
  );

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
            <div className="flex space-x-2 items-center">
              <CreateRoomDialog warehouseId={warehouseId} />
              <ImportDialog templateDownloader={WarehouseService.getImportRoomsTemplate} onUpload={onImportRooms} onSuccess={onImportSuccess} />
            </div>
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
                const total = room.totalCapacity || 1;
                const usagePercentage = (used / total) * 100;

                return (
                  <Card key={room.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{room.name}</h4>
                          <p className="text-sm text-gray-500">{room.storageType.name}</p>
                        </div>
                        <UpdateRoomDialog room={room} onUpdatedSuccess={onRoomUpdatedSuccess} />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4" onClick={() => onRoomSelect(room)}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Space usage</span>
                          <span className="font-medium">{usagePercentage.toFixed(2)}%</span>
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

        <div className="flex justify-center mt-5">
          <Pagination currentPage={query.page} onChangePage={onPageChange} pageCount={data?.totalPages ?? 1} />
        </div>

        {!loading && rooms.length === 0 && <div className="text-center py-8 text-gray-500">No matching room found</div>}
      </CardContent>
    </Card>
  );
};
