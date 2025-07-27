"use client";

import { Package } from "lucide-react";

import { StatsCard } from "@/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

interface EquipmentDetailProps {
  equipment: Equipment;
}

const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(price);

export function EquipmentDetail({ equipment }: EquipmentDetailProps) {
  const { data, loading } = useListing({
    fetcher: WarehouseService.getManagingWarehouseProducts,
    initialQuery: {
      equipmentId: equipment.id,
      page: 0,
      size: 20,
    },
  });

  const products: Product[] = data?.content ?? [];

  const totalValue = products.reduce((sum, product) => sum + product.price * product.stockQuantity, 0);
  const totalQuantity = products.reduce((sum, product) => sum + product.stockQuantity, 0);

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
          </div>
        </CardHeader>

        <CardContent>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>{product.stockQuantity.toLocaleString()}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{formatPrice(product.price * product.stockQuantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && products.length === 0 && <div className="text-center py-8 text-gray-500">No products found matching the filters</div>}
        </CardContent>
      </Card>
    </div>
  );
}
