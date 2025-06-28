"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";

interface DeleteConfirmationDialogProps {
  children?: React.ReactNode;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
}

export function DeleteConfirmationDialog({ children, onConfirm, title, description, itemName }: DeleteConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>{description}</p>
            <p className="font-medium">
              Bạn có chắc chắn muốn xóa: <span className="font-bold text-red-600">{itemName}</span>?
            </p>
            <p className="text-sm text-red-500">Hành động này không thể hoàn tác!</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>

          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
