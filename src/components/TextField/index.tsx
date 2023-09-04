import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import * as React from "react";

export type TextFieldProps = {
  label?: string;
  error?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ error, label, optional, className, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className={cn("space-y-1", className)}>
        {label && (
          <Label htmlFor={id}>
            {label}{" "}
            {optional && (
              <span className="text-xs text-gray-400">(opcional)</span>
            )}
          </Label>
        )}
        <Input
          {...props}
          id={id}
          data-error={!!error}
          className="data-[error=true]:border-red-500 data-[error=true]:focus-visible:ring-red-300"
          ref={ref}
        />

        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
