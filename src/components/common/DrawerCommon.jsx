"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";

import { Button } from "@/Component/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/Component/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBankAccountSchema } from "../../Pages/Banks/BankSchema";
import ComboboxCommon from "./ComboboxCommon";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export function DrawerCommon() {
  const [goal, setGoal] = React.useState(350);
  const initialState = {
    item: "",
  };
  const form = useForm({
    defaultValues: initialState,
    resolver: zodResolver(addBankAccountSchema),
  });
  function onClick(adjustment) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form>
              <ComboboxCom
                LABEL="Country"
                NAME="country"
                OPTIONS={[{ value: "ABV", label: "asdasd" }]}
                CONTROL={form.control}
                PLACEHOLDER="Select option..."
                CLASSNAME=""
                // onLoadMore={loadMoreCountries}
                // isLoading={isLoadingCountries}
              />
            </form>
          </Form>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export const CommonDrawer = ({
  title,
  description,
  children,
  trigger,
  isOpen,
  onOpenChange,
  onSave,
  showActions = true,
  fullWidth = false,
  height,
  loading,
}) => {
  const contentHeight = height;
  const maxHeightContent = `calc(${contentHeight} - 120px)`;
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={`h-[${contentHeight}] fixed `}>
        <div
          className={`${
            fullWidth ? "w-full px-4" : "max-w-4xl mx-auto"
          } w-full`}
        >
          <DrawerHeader className="relative border-b">
            <div className="flex justify-between items-center pr-32">
              <div>
                <DrawerTitle className="text-xl font-semibold">
                  {title}
                </DrawerTitle>
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </div>
              {showActions && (
                <div className="absolute right-12 top-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  {loading ? (
                    <>
                      {" "}
                      {/* <Button size="sm">
                        <Loader size={20} LOADING={false} /> Saving
                      </Button>
                   */}
                    </>
                  ) : (
                    <Button size="sm" onClick={onSave}>
                      Save
                    </Button>
                  )}
                </div>
              )}
              {/* <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <X className="h-4 w-4" />
              </DrawerClose> */}
            </div>
          </DrawerHeader>
          <div
            className={`p-4 pb-0 overflow-y-auto`}
            style={{ maxHeight: maxHeightContent, paddingBottom: "2rem" }}
          >
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default CommonDrawer;
export const ComboboxCom = ({
  LABEL,
  IS_REQUIRED = false,
  NAME,
  OPTIONS,
  CONTROL,
  PLACEHOLDER = "Select option...",
  CLASSNAME = "",
  DESCRIPTION = null,
}) => {
  return (
    <FormField
      control={CONTROL}
      name={NAME}
      render={({ field, fieldState }) => {
        const [open, setOpen] = React.useState(false);
        const commandListRef = React.useRef(null);
        React.useEffect(() => {
          const handleWheel = (e) => {
            if (!commandListRef.current) return;
            const rect = commandListRef.current.getBoundingClientRect();
            const isMouseOverCombobox =
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom;
            if (isMouseOverCombobox) {
              e.stopPropagation();
            }
          };
          window.addEventListener("wheel", handleWheel, { passive: false });
          return () => {
            window.removeEventListener("wheel", handleWheel);
          };
        }, [open]);
        return (
          <FormItem>
            <div className="flex items-center space-x-2 mb-2">
              <FormLabel>
                {LABEL}
                {IS_REQUIRED && <span className="text-red-500">*</span>}
              </FormLabel>
            </div>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      field.value ? "p-5" : "text-muted-foreground p-5",
                      CLASSNAME
                    )}
                  >
                    {field.value
                      ? OPTIONS.find((option) => option.value == field.value)
                          ?.label
                      : PLACEHOLDER}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search options..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup
                        ref={commandListRef}
                        className="max-h-60 overflow-y-auto relative"
                        onWheel={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {OPTIONS.map((option) => (
                          <CommandItem
                            key={option.label}
                            value={option.label}
                            onSelect={(currentValue) => {
                              field.onChange(
                                currentValue === field.value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            {DESCRIPTION && (
              <p className="text-sm text-gray-500 mt-1">{DESCRIPTION}</p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
