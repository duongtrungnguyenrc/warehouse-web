import { type FormEvent, type ReactNode, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { WarehouseService } from "@/services";

interface CreateWarehouseDialogProps {
  children: ReactNode;
  onSuccess?: (warehouse: Warehouse) => void;
}

export function CreateWarehouseDialog({ children, onSuccess }: CreateWarehouseDialogProps) {
  const [formData, setFormData] = useState<CreateWarehouseRequest>({
    name: "",
    address: "",
    areaSize: 0,
    type: "DC",
    manager: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const warehouse = await WarehouseService.create(formData);
      onSuccess?.(warehouse);
      setOpen(false);
      setFormData({
        name: "",
        address: "",
        areaSize: 0,
        type: "DC",
        manager: "",
      });
    } catch (error) {
      console.error("Failed to create warehouse:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Warehouse</DialogTitle>
          <DialogDescription>Fill in the details to create a new warehouse in the system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input id="name" placeholder="e.g., Northern Central Warehouse" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Warehouse Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as WarehouseType })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select warehouse type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DC">Distribution Center</SelectItem>
                  <SelectItem value="CW">Cold Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="areaSize">Area Size (m²) *</Label>
              <Input
                id="areaSize"
                type="number"
                placeholder="e.g., 5000"
                value={formData.areaSize || ""}
                onChange={(e) => setFormData({ ...formData, areaSize: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager ID *</Label>
              <Input id="manager" placeholder="Manager UUID" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} required />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
