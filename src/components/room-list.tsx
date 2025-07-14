import { ChevronRight, Grid3X3, Package, Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface RoomsListProps {
  warehouseId: string;
  onRoomSelect: (room: Room) => void;
}

export function RoomsList({ onRoomSelect }: RoomsListProps) {
  const { data } = useListing({
    fetcher: WarehouseService.getManagingWarehouseRooms,
  });

  const rooms = data?.content || [];

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms?.map((room) => {
            const usagePercentage = Math.round((0 / room.maxCapacity) * 100);

            return (
              <Card key={room.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={() => onRoomSelect(room)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{room.name}</h4>
                      <p className="text-sm text-gray-500">{room.storageTypeName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Space usage</span>
                      <span className="font-medium">{usagePercentage}%</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <div className="text-xs text-gray-500">0 / {room.maxCapacity.toLocaleString()} m³</div>
                  </div>

                  {/* Environment Info */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1 text-blue-500" />
                      <div className="flex items-center gap-x-1">
                        <div className="font-medium text-xs">0</div>
                        <div className="text-xs text-gray-500">Racks</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">Environment: {room.envSettings}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {rooms?.length === 0 && <div className="text-center py-8 text-gray-500">No matching room found</div>}
      </CardContent>
    </Card>
  );
}
