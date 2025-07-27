"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shadcn";

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";

export const chartConfig = {
  inbound: {
    label: "Inbound",
    color: "var(--chart-1)",
  },
  outbound: {
    label: "Outbound",
    color: "var(--chart-2)",
  },
} as const;
type Props = {
  data: { date: string; inbound: number; outbound: number }[];
};

export const WarehouseOperationChart = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <CardTitle>Warehouse statistics chart</CardTitle>
        <CardDescription>Showing warehouse statistics by month</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" labelFormatter={(value) => `${value} 2024`} />} />
            <Area dataKey="inbound" type="monotone" fill="url(#fillInbound)" stroke="var(--chart-1)" />
            <Area dataKey="outbound" type="monotone" fill="url(#fillOutbound)" stroke="var(--chart-2)" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
