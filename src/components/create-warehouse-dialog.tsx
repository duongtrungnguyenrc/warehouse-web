import type React from "react";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

interface CreateWarehouseDialogProps {
  children: React.ReactNode;
}

export function CreateWarehouseDialog({ children }: CreateWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    area: "",
    capacity: "",
    type: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating warehouse:", formData);
    setFormData({
      code: "",
      name: "",
      address: "",
      area: "",
      capacity: "",
      type: "",
      description: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Warehouse</DialogTitle>
          <DialogDescription>Fill in the details to create a new warehouse in the system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Warehouse Code *</Label>
              <Input id="code" placeholder="e.g., WH001" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Warehouse Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select warehouse type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Warehouse Name *</Label>
            <Input id="name" placeholder="e.g., Northern Central Warehouse" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter full address of the warehouse"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area Size (m²) *</Label>
              <Input id="area" type="number" placeholder="e.g., 5000" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (m³) *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 10000"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional notes or description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Warehouse</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
