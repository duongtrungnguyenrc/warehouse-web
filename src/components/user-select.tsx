"use client";

import { FormSelect } from "@/components";
import { useListing } from "@/hooks";
import { AccountService } from "@/services";

type UserSelectProps = {
  value?: string;
  role?: (Role | "*")[];
  setFieldValue: (field: string, value: any) => void;
  name?: string;
  placeholder?: string;
};

export const UserSelect = ({ value, setFieldValue, role = ["*"], name = "manager", placeholder = "Select manager" }: UserSelectProps) => {
  const { data } = useListing({
    fetcher: AccountService.list,
    initialQuery: {
      size: 100,
      page: 0,
    },
  });

  const options = (data?.content || []).filter((user) => role?.includes("*") || role?.includes(user.role)).map((user) => ({ value: user.userId, label: user.fullName }));

  return <FormSelect name={name} placeholder={placeholder} options={options} setFieldValue={setFieldValue} value={value} />;
};
