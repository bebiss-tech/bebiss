import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId, useState, type ComponentProps } from "react";

type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  label: string;
  error?: string;
  placeholder: string;
  options: Option[];
} & ComponentProps<typeof SelectRoot>;

const Select = ({
  options,
  error,
  label,
  placeholder,
  ...props
}: SelectProps) => {
  const id = useId();

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={id}>{label}</Label>}

      <SelectRoot {...props}>
        <SelectTrigger
          data-error={!!error}
          className="data-[error=true]:border-red-500 data-[error=true]:focus-visible:ring-red-300"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent id={id} position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </div>
  );
};

export default Select;
