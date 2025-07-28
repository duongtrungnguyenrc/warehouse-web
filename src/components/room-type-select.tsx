"use client";

import { FormSelect } from "@/components";
import { useListing } from "@/hooks";
import { RoomTypeService } from "@/services";

export const RoomTypeSelect = ({ value, setFieldValue }: { value?: string; setFieldValue: (field: string, value: any) => void }) => {
  const { data } = useListing({
    fetcher: RoomTypeService.getRoomTypes,
    initialQuery: {
      size: 100,
      page: 0,
    },
  });

  return (
    <FormSelect
      name="storageTypeId"
      placeholder="Select Room Type"
      options={(data?.content || []).map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))}
      setFieldValue={setFieldValue}
      value={value}
    />
  );
};
