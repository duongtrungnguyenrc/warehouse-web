"use client";

import { Droplets, MapPin, Package, Thermometer } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  temperature: string;
  humidity: string;
  status: string;
  productCount: number;
}

interface RoomGridProps {
  rooms: Room[];
  onRoomSelect: (roomId: string) => void;
}

export function RoomGrid({ rooms, onRoomSelect }: RoomGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const occupancyRate = Math.round((room.occupied / room.capacity) * 100);

        return (
          <Card key={room.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onRoomSelect(room.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <Badge className={getStatusColor(room.status)}>{getStatusText(room.status)}</Badge>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {room.location}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sử dụng không gian</span>
                  <span className="font-medium">{occupancyRate}%</span>
                </div>
                <Progress value={occupancyRate} className="h-2" />
                <div className="text-xs text-gray-500">
                  {room.occupied} / {room.capacity} m²
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-1 text-blue-500" />
                  <div>
                    <div className="font-medium">{room.productCount}</div>
                    <div className="text-xs text-gray-500">Sản phẩm</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                  <div>
                    <div className="font-medium">{room.temperature}</div>
                    <div className="text-xs text-gray-500">Nhiệt độ</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                  <div>
                    <div className="font-medium">{room.humidity}</div>
                    <div className="text-xs text-gray-500">Độ ẩm</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
