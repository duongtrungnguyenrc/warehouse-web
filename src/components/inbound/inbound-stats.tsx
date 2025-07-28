"use client";

import { useEffect } from "react";

import { StatsCard } from "@/components";
import { useQuery } from "@/hooks";
import { toastOnError } from "@/lib";
import { WarehouseService } from "@/services";

type Props = {
  type: "inbound" | "outbound";
};

export const WarehouseStats = ({ type }: Props) => {
  const { result, call, loading } = useQuery(WarehouseService.getWarehouseOperationStats);
  const data = result?.[type] ?? null;

  useEffect(() => {
    call().catch(toastOnError);
  }, [call]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard title="Total Orders" value={data?.total ?? null} description="Today" loading={loading} />
      <StatsCard title="In Progress" value={data?.inProgress ?? null} description="Orders" color="text-blue-600" loading={loading} />
      <StatsCard title="Cancelled" value={data?.cancelled ?? null} description="Orders" color="text-yellow-600" loading={loading} />
      <StatsCard title="Completed" value={data?.completed ?? null} description="Orders" color="text-green-600" loading={loading} />
    </div>
  );
};
