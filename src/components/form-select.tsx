import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn";

interface FormSelectProps {
  name: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  setFieldValue: (field: string, value: any) => void;
  value?: string;
}

export const FormSelect = ({ name, placeholder, options, setFieldValue, value }: FormSelectProps) => (
  <Select onValueChange={(val) => setFieldValue(name, val)} value={value}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
