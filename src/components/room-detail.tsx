import { ChevronRight, Layers, Plus } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface RoomDetailProps {
  room: Room;
  onRackSelect: (rack: Rack) => void;
}

export function RoomDetail({ room, onRackSelect }: RoomDetailProps) {
  const { data } = useListing({
    fetcher: WarehouseService.getManagingWarehouseRacks,
    initialQuery: {
      page: 0,
      size: 100,
      roomId: room.id,
    },
  });

  const racks = data?.content || [];

  const usedCapacity = racks.reduce((sum, rack) => sum + rack.usedSize, 0);
  const maxCapacity = racks.reduce((sum, rack) => sum + rack.maxSize, 0);
  const usagePercentage = maxCapacity === 0 ? 0 : Math.round((usedCapacity / maxCapacity) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Room Name</label>
                <p className="font-semibold">{room.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Storage Type</label>
                <p>{room.storageTypeName}</p>
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
                <span className="font-medium">{usedCapacity} slots</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{maxCapacity - usedCapacity} slots</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{maxCapacity} slots</span>
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Rack
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {racks.map((rack) => {
              const rackUsagePercentage = Math.round((rack.usedSize / rack.maxSize) * 100);

              return (
                <Card key={rack.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={() => onRackSelect(rack)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{rack.id}</h4>
                        <p className="text-sm text-gray-500">Position: {rack.slotNumber}</p>
                      </div>
                      <div>
                        <Badge className="bg-blue-50 text-blue-700">Full</Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage</span>
                        <span className="font-medium">{rackUsagePercentage}%</span>
                      </div>
                      <Progress value={rackUsagePercentage} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {rack.usedSize} / {rack.maxSize} slots
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
