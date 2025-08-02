"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker, StatsCard, WarehouseOperationChart } from "@/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ProductService, WarehouseService } from "@/services";

const StatisticsPage = () => {
  const [chartData, setChartData] = useState<{ date: string; inbound: number; outbound: number }[]>([]);
  const [topOutbound, setTopOutbound] = useState<Product[]>([]);
  const [leastOutbound, setLeastOutbound] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: start, to: now };
  });

  const fetchStatistics = async (range: DateRange) => {
    setLoading(true);
    try {
      const [chartRes, topRes, leastRes, totalRes] = await Promise.allSettled([
        WarehouseService.getStatistics(),
        ProductService.getTopOutboundProducts(range),
        ProductService.getLeastOutboundProducts(range),
        WarehouseService.getManaging(),
      ]);

      if (chartRes.status === "fulfilled") {
        const formatted = chartRes.value.map((item: any) => ({
          date: new Date(2024, item.month - 1).toLocaleString("en-US", { month: "short" }),
          inbound: item.inboundCount,
          outbound: item.outboundCount,
        }));
        setChartData(formatted);
      }

      if (topRes.status === "fulfilled") {
        setTopOutbound(topRes.value || []);
      }

      if (leastRes.status === "fulfilled") {
        setLeastOutbound(leastRes.value || []);
      }

      if (totalRes.status === "fulfilled") {
        setTotalProducts(totalRes.value.totalProducts || 0);
      }
    } catch (error) {
      console.error("Unexpected error in statistics loading", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchStatistics(dateRange);
    }
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Warehouse Statistics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Overview of warehouse management system</p>
        </div>
        <DateRangePicker onChange={(range) => setDateRange(range)} />
      </div>

      <WarehouseOperationChart data={chartData} />

      <StatsCard
        title="Total Products"
        value={totalProducts}
        description="Items in inventory"
        loading={loading}
        color=""
      />

      <ProductTable title="Top Outbound Products" products={topOutbound} loading={loading} />
      <ProductTable title="Least Outbound Products" products={leastOutbound} loading={loading} />
    </div>
  );
};

type ProductTableProps = {
  title: string;
  products: Product[];
  loading?: boolean;
};

const ProductTable = ({ title, products, loading }: ProductTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : products.length > 0 ? (
            products.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category?.name || "-"}</TableCell>
                <TableCell className="text-right">{p.stockQuantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default StatisticsPage;
