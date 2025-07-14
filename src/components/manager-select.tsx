import { FormSelect } from "@/components/form-select.tsx";
import { useListing } from "@/hooks";
import { AccountService } from "@/services";

export const ManagerSelect = ({ value, setFieldValue }: { value?: string; setFieldValue: (field: string, value: any) => void }) => {
  const { data } = useListing({
    fetcher: AccountService.list,
    initialQuery: {
      size: 100,
      page: 0,
    },
  });

  return (
    <FormSelect
      name="manager"
      placeholder="Select manager"
      options={(data?.content || []).map((user) => ({ value: user.userId, label: user.fullName }))}
      setFieldValue={setFieldValue}
      value={value}
    />
  );
};
