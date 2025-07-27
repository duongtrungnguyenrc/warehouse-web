"use client";

import { FormSelect } from "@/components";
import { useListing } from "@/hooks";
import { ProductService } from "@/services";

type ProductSelectProps = {
  value?: string;
  setFieldValue: (field: string, value: any) => void;
  name?: string;
};

export const ProductSelect = ({ value, setFieldValue, name = "product" }: ProductSelectProps) => {
  const { data, fetchNext } = useListing({
    fetcher: ProductService.listManaging,
    initialQuery: {
      size: 100,
      page: 0,
    },
  });

  const options = (data?.content || []).map((product) => ({ value: product.sku, label: product.name }));

  return <FormSelect onScrollEnd={fetchNext} name={name} placeholder="Select product" options={options} setFieldValue={setFieldValue} value={value} />;
};
