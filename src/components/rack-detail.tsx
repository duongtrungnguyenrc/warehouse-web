"use client";

import { Box, ChevronRight } from "lucide-react";
import { useCallback } from "react";

import { CreateEquipmentsDialog } from "./create-equipments-dialog";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";
import { Pagination, RoleProtect } from "./common";

interface RackDetailProps {
  rack: Rack;
  onEquipmentSelect: (equipment: Equipment) => void;
}

export function RackDetail({ rack, onEquipmentSelect }: RackDetailProps) {
  const { data, loading, query, append, setQuery } = useListing({
    fetcher: WarehouseService.getManagingWarehouseEquipments,
    initialQuery: {
      page: 0,
      size: 20,
      rackId: rack.id,
    },
  });

  const equipments = data?.content || [];
  const usagePercentage = Math.round((rack.usedSize / rack.maxSize) * 100);

  const onCreateEquipmentSuccess = useCallback(
    (newEquipments: Equipment[]) => {
      append(...newEquipments);
    },
    [append],
  );

  const onPageChange = (page: number) => setQuery({ page });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Rack Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Equipments</label>
                <p className="font-semibold">{rack.totalEquipment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className="bg-gray-50 text-gray-700">{rack.status}</Badge>
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
              <div className="text-3xl font-bold">{usagePercentage.toFixed(2)}%</div>
              <p className="text-sm text-gray-500">Used</p>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{rack.maxSize.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Used:</span>
                <span className="font-medium">{rack.usedSize.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{rack.remainingSize.toFixed(2)} m³</span>
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
                <Box className="h-5 w-5" />
                Equipment List
              </CardTitle>
              <CardDescription>Devices stored in this rack</CardDescription>
            </div>

            <RoleProtect role={["MANAGER"]}>
              <CreateEquipmentsDialog onSuccess={onCreateEquipmentSuccess} />
            </RoleProtect>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              : equipments.map((equipment, index) => (
                  <Card key={equipment.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={() => onEquipmentSelect(equipment)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Equipment {query.page * query.size + index + 1}</h4>
                          <p className="text-sm text-gray-500">LPN: {equipment.lpn}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Max Capacity:</span>
                        <span className="font-medium">{equipment.maxSize.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span className="font-medium">{equipment.usedSize.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium">{equipment.remainingSize.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created At:</span>
                        <span>{new Date(equipment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <div className="flex justify-center mt-5">
            <Pagination currentPage={query.page} onChangePage={onPageChange} pageCount={data?.totalPages ?? 1} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
