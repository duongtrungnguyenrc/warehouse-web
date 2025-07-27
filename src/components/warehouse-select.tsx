"use client";


import { FormSelect } from "@/components";
import { useListing } from "@/hooks";
import { WarehouseService } from "@/services";

export const WarehouseSelect = ({ value, setFieldValue }: { value?: string; setFieldValue: (field: string, value: any) => void }) => {
  const { data } = useListing({
    fetcher: WarehouseService.list,
    initialQuery: {
      size: 100,
      page: 0,
    },
  });

  return (
    <FormSelect
      name="warehouseId"
      placeholder="Select warehouse"
      options={(data?.content || []).map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))}
      setFieldValue={setFieldValue}
      value={value}
    />
  );
};
