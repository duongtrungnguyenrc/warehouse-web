import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

interface UpdateWarehouseDialogProps {
  warehouse: Warehouse | null;
  children?: ReactNode;
  onUpdate: (warehouse: Warehouse) => void;
}

export function UpdateWarehouseDialog({ warehouse, children, onUpdate }: UpdateWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    areaSize: "",
    capacity: "",
    status: "ACTIVE" as WarehouseStatus,
    managerName: "",
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        address: warehouse.address,
        areaSize: warehouse.areaSize.toString(),
        capacity: warehouse.usedCapacity.toString(),
        status: warehouse.status,
        managerName: warehouse.manager!,
      });
    }
  }, [warehouse]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!warehouse) return;

    const updatedWarehouse: Warehouse = {
      ...warehouse,
      name: formData.name,
      address: formData.address,
      areaSize: parseInt(formData.areaSize),
      usedCapacity: parseInt(formData.capacity),
      status: formData.status,
      manager: "",
    };

    onUpdate(updatedWarehouse);
  };

  if (!warehouse) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Warehouse</DialogTitle>
          <DialogDescription>Edit warehouse information: {warehouse.id}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as WarehouseStatus })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="areaSize">Area Size (m²) *</Label>
              <Input id="areaSize" type="number" value={formData.areaSize} onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (m³) *</Label>
              <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Manager *</Label>
            <Input id="manager" value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} required />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
