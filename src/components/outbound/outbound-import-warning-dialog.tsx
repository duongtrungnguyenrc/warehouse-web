"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";

type OutboundImportWarningDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  validationResult?: OutboundValidateResponse;
  onProcess: VoidFunction;
  onCancel: VoidFunction;
};

export const OutboundImportWarningDialog = ({ open, setOpen, validationResult, onCancel, onProcess }: OutboundImportWarningDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Inventory Validation Results
          </AlertDialogTitle>
          <AlertDialogDescription>Some items have insufficient inventory. Review the details below and choose how to proceed.</AlertDialogDescription>
        </AlertDialogHeader>

        {validationResult && (
          <div className="space-y-4">
            {/* Sufficient Products */}
            {validationResult.sufficientProducts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Available Items ({validationResult.sufficientProducts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {validationResult.sufficientProducts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="font-medium">{item.sku}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Qty: {item.quantity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Insufficient Products */}
            {validationResult.sufficientProducts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Insufficient Items ({validationResult.insufficientProducts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {validationResult.insufficientProducts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="font-medium">{item.sku}</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Requested: {item.quantity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {!validationResult?.canProceed && <AlertDialogAction onClick={onProcess}>Proceed with Available Items Only</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
