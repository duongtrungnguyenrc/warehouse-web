"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker, StatsCard, WarehouseOperationChart } from "@/components";
import { ProductService, WarehouseService } from "@/services";

const StatisticsPage = () => {
  const [chartData, setChartData] = useState<{ date: string; inbound: number; outbound: number }[]>([]);
  const [topOutbound, setTopOutbound] = useState<number | null>(null);
  const [leastOutbound, setLeastOutbound] = useState<number | null>(null);
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
        setTopOutbound(topRes.value.length || 0);
      }

      if (leastRes.status === "fulfilled") {
        setLeastOutbound(leastRes.value.length || 0);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Warehouse Statistics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Overview of warehouse management system</p>
        </div>
        <DateRangePicker onChange={(range) => setDateRange(range)} />
      </div>

      <div>
        <WarehouseOperationChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard title="Total Products" value={totalProducts} description="Items in inventory" loading={loading} color="" />
        <StatsCard title="Top Outbound Products" value={topOutbound} description="Best moving products" loading={loading} color="text-green-600" />
        <StatsCard title="Least Outbound Products" value={leastOutbound} description="Slow moving items" loading={loading} color="text-yellow-600" />
      </div>
    </div>
  );
};

export default StatisticsPage;
