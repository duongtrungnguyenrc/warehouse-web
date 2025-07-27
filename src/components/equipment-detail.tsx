"use client";

import { Download, Package, Plus, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { StatsCard } from "@/components";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface EquipmentDetailProps {
  equipment: Equipment;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-stock":
      return "bg-green-50 text-green-700";
    case "low-stock":
      return "bg-yellow-50 text-yellow-700";
    case "out-of-stock":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
    default:
      return "Unknown";
  }
};

const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(price);

export function EquipmentDetail({ equipment }: EquipmentDetailProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, loading } = useListing({
    fetcher: WarehouseService.getManagingWarehouseProducts,
    initialQuery: {
      equipmentId: equipment.id,
      page: 0,
      size: 20,
    },
  });

  const products: Product[] = data?.content ?? [];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const stockStatus = product.stockQuantity > 0 ? (product.stockQuantity < 10 ? "low-stock" : "in-stock") : "out-of-stock";
    const matchesStatus = filterStatus === "all" || stockStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredProducts.reduce((sum, product) => sum + product.price * product.stockQuantity, 0);
  const totalQuantity = filteredProducts.reduce((sum, product) => sum + product.stockQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="LPN" value={equipment.lpn} description="License Plate Number" loading={loading} />
          <StatsCard title="Total Products" value={products.length} description="Number of distinct products" loading={loading} />
          <StatsCard title="Total Quantity" value={totalQuantity} description="Sum of all product quantities" loading={loading} />
          <StatsCard title="Total Value" value={formatPrice(totalValue) as unknown as number} description="Total inventory value (VND)" loading={loading} />
        </div>
      )}

      {/* Equipment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">LPN</label>
              <p className="font-semibold">{equipment.lpn}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Max Capacity</label>
              <p>{equipment.maxSize.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Remaining Capacity</label>
              <p>{equipment.remainingSize.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product List
              </CardTitle>
              <CardDescription>Products stored in this equipment</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    {/*<TableHead >Actions</TableHead>*/}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = product.stockQuantity > 0 ? (product.stockQuantity < 10 ? "low-stock" : "in-stock") : "out-of-stock";
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.stockQuantity.toLocaleString()}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>{formatPrice(product.price * product.stockQuantity)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(stockStatus)}>{getStatusText(stockStatus)}</Badge>
                        </TableCell>
                        {/*<TableCell >*/}
                        {/*  <div className="flex items-center justify-end gap-2">*/}
                        {/*    <Button variant="ghost" size="sm">*/}
                        {/*      <Edit className="h-4 w-4" />*/}
                        {/*    </Button>*/}
                        {/*    <Button variant="ghost" size="sm">*/}
                        {/*      <Trash2 className="h-4 w-4" />*/}
                        {/*    </Button>*/}
                        {/*  </div>*/}
                        {/*</TableCell>*/}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && <div className="text-center py-8 text-gray-500">No products found matching the filters</div>}
        </CardContent>
      </Card>
    </div>
  );
}
