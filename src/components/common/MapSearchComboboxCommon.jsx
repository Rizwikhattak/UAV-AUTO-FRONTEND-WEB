"use client";

import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MapDialog } from "@/components/station/MapDialog";

/**
 * @param {object} props
 * @param {import("react-hook-form").Control} props.control - The form control from React Hook Form
 * @param {string} props.name - The field name
 * @param {string} [props.label] - Label for the field
 * @param {Array} props.items - An array of items, each item having { id, name }
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.formType="normal"] - If "card", you can apply special styling
 */
export function MapSearchComboboxCommon({
  control,
  name,
  label,
  items = [],
  placeholder = "Select a location...",
  formType = "normal",
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // State to control the popover open/close
        const [open, setOpen] = React.useState(false);

        // Find the currently selected item, if any
        const selectedItem = items.find(
          (item) => String(item.id) === field.value
        );

        return (
          <FormItem
            className={formType === "card" ? "flex items-center gap-2" : ""}
          >
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedItem ? selectedItem.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[20rem] p-0">
                  <Command>
                    <CommandInput placeholder={`Search ${label || ""}...`} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="chooseMap"
                          value="chooseMap"
                          onSelect={(currentValue) => {
                            // Update the RHF field value
                            field.onChange(currentValue);
                            // setOpen(false);
                          }}
                        >
                          <MapDialog
                            triggerButton={
                              <div className="text-[var(--primary-custom)] flex items-center gap-2 w-full">
                                <span>
                                  <Image
                                    width={15}
                                    height={15}
                                    src="/Location.png"
                                    alt="Location"
                                  />
                                </span>
                                <span>Choose on map</span>
                              </div>
                            }
                          />
                        </CommandItem>
                        {items.map((item) => {
                          const valueStr = String(item.id);
                          return (
                            <CommandItem
                              key={valueStr}
                              value={valueStr}
                              onSelect={(currentValue) => {
                                // Update the RHF field value
                                field.onChange(currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === valueStr
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
