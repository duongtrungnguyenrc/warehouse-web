import { AlertTriangle, HelpCircle } from "lucide-react";
import { type ReactNode, useRef } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";

interface ConfirmationDialogProps {
  children?: ReactNode;
  onConfirm?: (hide: VoidFunction) => void;
  title: string;
  description: string;
  itemName?: string;
  type?: "delete" | "confirm";
  confirmText?: string;
  cancelText?: string;
}

const dialogVariant = {
  delete: {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    titleColor: "text-red-600",
    actionColor: "destructive",
    warningText: "Hành động này không thể hoàn tác!",
    confirmLabel: "Xóa",
  },
  confirm: {
    icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
    titleColor: "text-blue-600",
    actionColor: "default",
    warningText: "",
    confirmLabel: "Xác nhận",
  },
};

export const ConfirmDialog = ({ children, onConfirm, title, description, itemName, type = "delete", confirmText, cancelText }: ConfirmationDialogProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const variant = dialogVariant[type];

  const hide = () => closeRef.current?.click();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${variant.titleColor}`}>
            {variant.icon}
            <span>{title}</span>
          </DialogTitle>

          <DialogDescription className="space-y-2">
            <span>{description}</span>
            {itemName && (
              <span className="font-medium">
                Bạn có chắc chắn muốn thực hiện với: <span className={`font-bold ${variant.titleColor}`}>{itemName}</span>?
              </span>
            )}
            {variant.warningText && <p className="text-sm text-red-500">{variant.warningText}</p>}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" ref={closeRef}>
              {cancelText || "Hủy"}
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
