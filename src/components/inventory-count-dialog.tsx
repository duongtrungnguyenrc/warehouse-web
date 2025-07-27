"use client";

import { AlertTriangle, CheckCircle, Minus, Plus, Scan } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

interface CountItem {
  id: string;
  sku: string;
  name: string;
  location: string;
  systemQty: number;
  countedQty: number;
  difference: number;
  status: "pending" | "counted" | "discrepancy";
}

interface InventoryCountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryCountDialog({ open, onOpenChange }: InventoryCountDialogProps) {
  const [countType, setCountType] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [scannedCode, setScannedCode] = useState("");

  const [countItems, setCountItems] = useState<CountItem[]>([
    {
      id: "1",
      sku: "PD001",
      name: "Nước suối Aqua 330ml",
      location: "A01.01.1",
      systemQty: 100,
      countedQty: 98,
      difference: -2,
      status: "discrepancy",
    },
    {
      id: "2",
      sku: "PD002",
      name: "Bánh quy Oreo 137g",
      location: "A01.02.1",
      systemQty: 50,
      countedQty: 50,
      difference: 0,
      status: "counted",
    },
    {
      id: "3",
      sku: "PD003",
      name: "Sữa tươi TH True Milk 1L",
      location: "B01.01.1",
      systemQty: 75,
      countedQty: 0,
      difference: 0,
      status: "pending",
    },
  ]);

  const handleScan = () => {
    if (!scannedCode) return;

    // Simulate scanning logic
    const item = countItems.find((item) => item.sku === scannedCode || item.location === scannedCode);
    if (item) {
      // Focus on the item for counting
      console.log("Found item:", item);
    }
    setScannedCode("");
  };

  const updateCount = (itemId: string, newCount: number) => {
    setCountItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const difference = newCount - item.systemQty;
          return {
            ...item,
            countedQty: newCount,
            difference,
            status: difference === 0 ? "counted" : "discrepancy",
          };
        }
        return item;
      }),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "counted":
        return "bg-green-50 text-green-700";
      case "discrepancy":
        return "bg-red-50 text-red-700";
      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "counted":
        return "Đã kiểm";
      case "discrepancy":
        return "Chênh lệch";
      default:
        return "Chờ kiểm";
    }
  };

  const totalItems = countItems.length;
  const countedItems = countItems.filter((item) => item.status !== "pending").length;
  const discrepancyItems = countItems.filter((item) => item.status === "discrepancy").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>Kiểm Kê Hàng Hóa</span>
          </DialogTitle>
          <DialogDescription>Thực hiện kiểm kê và đối chiếu số lượng hàng hóa thực tế</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Count Setup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Loại Kiểm Kê</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={countType} onValueChange={setCountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại kiểm kê" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Kiểm kê toàn bộ</SelectItem>
                    <SelectItem value="zone">Kiểm kê theo khu vực</SelectItem>
                    <SelectItem value="cycle">Kiểm kê định kỳ</SelectItem>
                    <SelectItem value="spot">Kiểm kê đột xuất</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Khu Vực</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Khu A - Hàng khô</SelectItem>
                    <SelectItem value="B">Khu B - Hàng lạnh</SelectItem>
                    <SelectItem value="C">Khu C - Hàng đông lạnh</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quét Mã</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Quét mã SKU hoặc vị trí"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleScan()}
                  />
                  <Button size="sm" onClick={handleScan}>
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {countedItems}/{totalItems}
                    </p>
                    <p className="text-sm text-gray-500">Đã kiểm</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{discrepancyItems}</p>
                    <p className="text-sm text-gray-500">Chênh lệch</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">%</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round((countedItems / totalItems) * 100)}%</p>
                    <p className="text-sm text-gray-500">Hoàn thành</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Count Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Kiểm Kê</CardTitle>
              <CardDescription>Nhập số lượng thực tế đã kiểm đếm</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Tên Sản Phẩm</TableHead>
                    <TableHead>Vị Trí</TableHead>
                    <TableHead>Hệ Thống</TableHead>
                    <TableHead>Thực Tế</TableHead>
                    <TableHead>Chênh Lệch</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="font-mono">{item.location}</TableCell>
                      <TableCell>{item.systemQty}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm" onClick={() => updateCount(item.id, Math.max(0, item.countedQty - 1))}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input type="number" value={item.countedQty} onChange={(e) => updateCount(item.id, Number.parseInt(e.target.value) || 0)} className="w-16 text-center" />
                          <Button variant="outline" size="sm" onClick={() => updateCount(item.id, item.countedQty + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={item.difference === 0 ? "text-green-600" : "text-red-600"}>
                          {item.difference > 0 ? "+" : ""}
                          {item.difference}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Scan className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button>Hoàn Thành Kiểm Kê</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
