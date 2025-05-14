"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, InputPassword } from "../ui/input";
import { CircleAlert } from "lucide-react";

const InputCommon = ({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
  formType = "normal",
  Icon = <CircleAlert color="red" size="20" />,
  ...props
}) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <div
              className={`${
                formType === "card" ? "flex items-center gap-2" : "space-y-2"
              }`}
            >
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {inputType === "password" ? (
                  <InputPassword
                    placeholder={placeholder}
                    value={String(field.value) ?? ""}
                    type={inputType}
                    {...field}
                    {...props}
                  />
                ) : (
                  <Input
                    type={inputType}
                    value={String(field.value) ?? ""}
                    placeholder={placeholder}
                    {...field}
                  />
                )}
              </FormControl>
            </div>
            <div className="flex items-center gap-3">
              {fieldState.error ? Icon : null}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default InputCommon;
