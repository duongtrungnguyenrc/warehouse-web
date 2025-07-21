import * as React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn";

type WarehouseTypeSelectProps = {
  handleChange: {
    /** Classic React change handler, keyed by input name */
    (e: React.ChangeEvent<any>): void;
    /** Preact-like linkState. Will return a handleChange function.  */
    <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  value: string;
};

export const WarehouseStatusSelect = ({ value, handleChange }: WarehouseTypeSelectProps) => {
  return (
    <Select value={value} onValueChange={(value) => handleChange({ target: { name: "status", value } })}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select warehouse status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="CLOSED">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
};
