"use client";

import { Edit, Settings } from "lucide-react";
import { useCallback, useState } from "react";

import { CreateRoomTypeDialog } from "./create-room-type-dialog";
import { UpdateRoomTypeDialog } from "./update-room-type-dialog";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { RoomTypeService } from "@/services";

export const RoomTypeManagementDialog = () => {
  const [open, setOpen] = useState(false);

  const { data, loading, append, update } = useListing({
    fetcher: RoomTypeService.getRoomTypes,
    initialQuery: { page: 0, size: 20 },
  });

  const roomTypes = data?.content || [];

  const handleCreate = useCallback(
    (newRoomType: RoomType) => {
      append(newRoomType);
    },
    [append],
  );

  const handleUpdate = useCallback(
    (updatedRoomType: RoomType) => {
      update(
        (prev) => prev.id === updatedRoomType.id,
        () => updatedRoomType,
      );
    },
    [update],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage Room Types
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Room Type Management</DialogTitle>
          <DialogDescription>Create, edit, and manage room types for your warehouse.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create Button */}
          <div className="flex justify-end">
            <CreateRoomTypeDialog onSuccess={handleCreate} />
          </div>

          {/* Room Type List */}
          <div className="grid gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : roomTypes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No room types found</p>
                  <CreateRoomTypeDialog onSuccess={handleCreate} />
                </CardContent>
              </Card>
            ) : (
              roomTypes.map((roomType) => (
                <Card key={roomType.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{roomType.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{roomType.description}</CardDescription>
                      </div>

                      <UpdateRoomTypeDialog roomType={roomType} onSuccess={handleUpdate}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </UpdateRoomTypeDialog>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          {!loading && roomTypes.length > 0 && <div className="text-sm text-muted-foreground text-center">Showing {roomTypes.length} room types</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
