import { AlertTriangle, HelpCircle } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";

interface ConfirmationDialogProps {
  children?: ReactNode;
  onConfirm?: (hide: VoidFunction) => void;
  title: string;
  itemName?: string;
  type?: "delete" | "confirm";
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const dialogVariant = {
  delete: {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    titleColor: "text-red-600",
    actionColor: "destructive",
    warningText: "This action cannot be undone!",
    confirmLabel: "Yes",
  },
  confirm: {
    icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
    titleColor: "text-blue-600",
    actionColor: "default",
    warningText: "",
    confirmLabel: "Yes",
  },
};

export const ConfirmDialog = ({ children, onConfirm, title, itemName, type = "delete", confirmText, cancelText, open, setOpen }: ConfirmationDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const variant = dialogVariant[type];

  const hide = () => closeRef.current?.click();

  return (
    <Dialog open={open || internalOpen} onOpenChange={setOpen || setInternalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${variant.titleColor}`}>
            {variant.icon}
            <span>{title}</span>
          </DialogTitle>

          <DialogDescription>
            {itemName && (
              <p className="font-medium">
                Are you sure you want to proceed with: <span className={`font-bold ${variant.titleColor}`}>{itemName}</span>?
              </p>
            )}
            {variant.warningText && <p className="text-sm text-red-500">{variant.warningText}</p>}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" ref={closeRef}>
              {cancelText || "Cancel"}
            </Button>
          </DialogClose>

          <Button
            variant={variant.actionColor as any}
            onClick={() => {
              onConfirm?.(hide);
            }}
          >
            {confirmText || variant.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
