import { FormSelect } from "@/components/form-select.tsx";
import { useListing } from "@/hooks";
import { CategoryService } from "@/services";

export const CategorySelect = ({ value, setFieldValue }: { value: string; setFieldValue: (field: string, value: any) => void }) => {
  const { data } = useListing({
    fetcher: CategoryService.list,
    initialQuery: {
      limit: 100,
      page: 0,
    },
  });

  return (
    <FormSelect
      name="categoryId"
      placeholder="Select category"
      options={(data?.content || []).map((cat) => ({ value: cat.id, label: cat.name }))}
      setFieldValue={setFieldValue}
      value={value}
    />
  );
};
