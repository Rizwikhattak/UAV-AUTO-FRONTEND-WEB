"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Typography } from "../ui/Typography";
import { Calendar } from "../ui/calendar";
import SpinnerCommon from "./SpinnerCommon";
import { Checkbox } from "../ui/checkbox";
import { Input, InputPassword } from "../ui/input";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  Search,
  CalendarIcon,
  CircleAlert,
  UploadCloud,
  Trash,
  Check,
  Upload,
  ImageIcon,
  X,
  Trash2,
  Plus,
  ClockIcon,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
export const InputCommon = ({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
  formType = "normal",
  className = "",
  Icon = (
    <CircleAlert
      color="red"
      size={14}
      className="mb-[2px]"
      strokeWidth={1.65}
    />
  ),
  placeholderIcon = <Search size={16} color="#9ca3af " strokeWidth={1.75} />,
  withIcon = false,
  showErrorMessage = true,
  ...props
}) => {
  const { watch } = useFormContext();
  const watchValue = watch(name);
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <div
              className={`${
                formType === "card"
                  ? "flex items-center gap-2 "
                  : `space-y-[4px] ${!showErrorMessage ? "" : "mt-2"}`
              }`}
            >
              <FormLabel htmlFor={name}>{label}</FormLabel>
              <FormControl>
                {inputType === "password" ? (
                  <InputPassword
                    id={name}
                    placeholder={placeholder}
                    aria-invalid={fieldState.error ? true : false}
                    type={inputType}
                    className={cn("px-16", className)}
                    {...field}
                    {...props}
                  />
                ) : !withIcon ? (
                  <Input
                    id={name}
                    type={inputType}
                    placeholder={placeholder}
                    aria-invalid={fieldState.error ? true : false}
                    className={cn("!px-4 h-10 shadow-sm", className)}
                    {...field}
                    {...props}
                  />
                ) : (
                  <div className="flex items-center">
                    <Input
                      id={name}
                      type={inputType}
                      placeholder={placeholder}
                      aria-invalid={fieldState.error ? true : false}
                      className={cn("!px-4 !h-10 shadow-sm", className)}
                      {...field}
                      {...props}
                    />
                    <div className="-m-6">{placeholderIcon}</div>
                  </div>
                )}
              </FormControl>
            </div>
            {showErrorMessage && (
              <div className="flex items-center gap-1">
                {fieldState.error ? Icon : null}
                <FormMessage className="!p-0 !m-0" />
              </div>
            )}
          </FormItem>
        )}
      />
    </>
  );
};
export function DateTimePickerCommon({
  control,
  dateName = "start_date",
  timeName = "start_time",
  className,
}) {
  // Hook up to both fields via useController
  const {
    field: dateField,
    fieldState: { error: dateError },
  } = useController({ name: dateName, control });
  const {
    field: timeField,
    fieldState: { error: timeError },
  } = useController({ name: timeName, control });

  // Watch just the two fields from the form
  const watchedDate = useWatch({ control, name: dateName });
  const watchedTime = useWatch({ control, name: timeName });

  // Parse initial field values if they exist
  const initialDate = React.useMemo(() => {
    if (!dateField.value) return null;
    try {
      return new Date(dateField.value);
    } catch (err) {
      return null;
    }
  }, [dateField.value]);

  const initialTime = React.useMemo(() => {
    if (!timeField.value) return { hour: "", minute: "" };
    const [h, m] = timeField.value.split(":");
    return { hour: h || "", minute: m || "" };
  }, [timeField.value]);

  // Local states for UI
  const [date, setDate] = React.useState(initialDate);
  const [time, setTime] = React.useState(initialTime);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Reset local states when form fields are cleared
  React.useEffect(() => {
    if (!watchedDate) {
      setDate(null);
    }
  }, [watchedDate]);

  React.useEffect(() => {
    if (!watchedTime) {
      setTime({ hour: "", minute: "" });
    }
  }, [watchedTime]);

  // Format the combined user selection for the trigger button
  const formattedDateTime = React.useMemo(() => {
    if (!date) return "Pick date & time";
    const dayString = format(date, "PPP");
    const hour = time.hour || "00";
    const minute = time.minute || "00";
    const timeString = `${hour}:${minute}`;
    return `${dayString} at ${timeString}`;
  }, [date, time]);

  // Handle time changes from the <Select> components
  const handleTimeChange = (type, value) => {
    setTime((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  // "Confirm" button updates both fields in React Hook Form
  const handleConfirm = () => {
    if (date) {
      dateField.onChange(format(date, "yyyy-MM-dd"));
    }
    if (time.hour !== "" && time.minute !== "") {
      timeField.onChange(`${time.hour}:${time.minute}`);
    }
    setIsPopoverOpen(false);
  };
  return (
    <div className={cn("w-full", className)}>
      {/* Date Field Label */}
      <div className="mb-1 flex items-center gap-1 text-sm font-medium text-foreground">
        <CalendarIcon className="w-4 h-4" />
        <span>Start Date & Time</span>
      </div>
      {/* Popover for selecting date/time */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDateTime}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 h-[15rem] overflow-y-auto"
          align="start"
        >
          {/* Calendar for date */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />

          {/* Time selection */}
          <div className="p-3 border-t border-border w-full">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="flex items-center justify-between mt-2 w-full">
              <Select
                value={time.hour}
                onValueChange={(val) => handleTimeChange("hour", val)}
              >
                <SelectTrigger className="w-[48%]">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hr = String(i).padStart(2, "0");
                    return (
                      <SelectItem key={hr} value={hr}>
                        {hr}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span className="text-center text-muted-foreground">:</span>
              <Select
                value={time.minute}
                onValueChange={(val) => handleTimeChange("minute", val)}
              >
                <SelectTrigger className="w-[48%]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => {
                    const min = String(i).padStart(2, "0");
                    return (
                      <SelectItem key={min} value={min}>
                        {min}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full mt-3"
              variant="hover-blue-full"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Field errors */}
      {dateError && (
        <p className="text-sm text-red-500 mt-1">{dateError.message}</p>
      )}
      {timeError && (
        <p className="text-sm text-red-500 mt-1">{timeError.message}</p>
      )}
    </div>
  );
}
export const CardInputCommon = ({ name = "image", control }) => {
  const { setValue, watch } = useFormContext();
  const imageValue = watch(name);
  console.log("Image Value", imageValue);
  const openFilePicker = () => {
    document.getElementById(name).click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue(name, file); // Store file in React Hook Form
    }
  };

  // Helper to render the appropriate image
  const renderImage = () => {
    // 1. If the user selected a File:
    if (imageValue instanceof File) {
      return (
        <img
          src={URL.createObjectURL(imageValue)}
          alt="Selected"
          className="h-full w-full object-fit rounded-md"
        />
      );
    }
    // 2. If imageValue is a string (existing URL from server)
    if (typeof imageValue === "string" && imageValue.length > 0) {
      return (
        <img
          src={imageValue}
          alt="Existing"
          className="h-full w-full object-fit rounded-md"
        />
      );
    }
    // 3. Fallback (no image)
    return <Plus className="text-gray-500" />;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="image-input flex flex-col items-center justify-center">
          <FormControl>
            <div>
              <input
                id={name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {/* Card Clickable to Open File Picker */}
              <Card
                className="cursor-pointer w-72 flex items-center justify-center hover:bg-gray-200 transition-all ease-in-out shadow-lg !p-0"
                onClick={openFilePicker}
              >
                <CardContent className="h-40 flex items-center justify-center w-full !p-0">
                  {renderImage()}
                </CardContent>
              </Card>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export function UserSelectorCommon({
  title = "Select users who can access this business",
  placeholder = "Search here",
  onChange,
  intitialUsers = [],
  users = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(intitialUsers);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(
      (user) =>
        !selectedUsers.some((selected) => selected.id === user.id) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, selectedUsers]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onChange?.(selectedUsers);
  }, [selectedUsers, onChange]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {isDropdownOpen && filteredUsers.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1.5 bg-gray-100 rounded-full pl-1 pr-2 py-1"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const CheckboxGroupCardsCommon = ({
  control,
  name,
  label,
  options = [],
  isLoading = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      // The 'render' prop gives us access to the 'field' object from RHF
      render={({ field }) => {
        // The field's value should be an array of selected option IDs
        // The field's onChange expects a new array of IDs

        const handleCheckboxChange = (optionId, checked) => {
          if (checked) {
            // Add the option to the selected values
            field.onChange([...field.value, optionId]);
          } else {
            // Remove the option from the selected values
            field.onChange(field.value.filter((id) => id !== optionId));
            // Ensure this closing brace is correctly placed and matches an opening brace
          }
        };

        return (
          <FormItem>
            {/* Optional label for the entire checkbox group */}
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`skeleton-${i}`}
                          className="border rounded-md p-4 shadow-sm"
                        >
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))
                  : options.map((option) => {
                      const checkboxId = `checkbox-${option.id}`;
                      const isChecked = field.value?.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "border rounded-md p-4 transition-all hover:border-primary-custom",
                            isChecked
                              ? "border-primary-custom bg-primary-custom/5"
                              : "border-border"
                          )}
                        >
                          <label
                            htmlFor={checkboxId}
                            className="flex items-start gap-3 cursor-pointer"
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(option.id, checked)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="text-base font-medium">
                                {option.name}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {/* Optionally use a description if available */}
                                {option?.description ||
                                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, qui?"}
                              </p>
                            </div>
                          </label>
                        </div>
                      );
                    })}
              </div>
            </FormControl>

            {/* Displays validation errors from RHF/Zod if any */}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const ComboboxCommonWihInput = ({
  control,
  name,
  label,
  items = [],
  placeholder,
  style = "",
  onLoadMore,
  isLoading,
  // handleDebouncingSearch,
  initialData = null,
  className = "",
  setPhoneNoInput,
  phoneNoInput,
  selectedCountry,
  initialValue,
  setInitialValue,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const listRef = React.useRef(null);
  const commandListRef = React.useRef(null);
  const [query, setQuery] = React.useState("");
  // Track if we've initiated loading more items to prevent duplicate requests
  const isLoadingRef = React.useRef(false);
  // const [initialValue, setInitialValue] = React.useState(initialData);
  const { setValue } = useFormContext();
  // React.useEffect(() => {
  //   if (query) {
  //     handleDebouncingSearch(query);
  //   }
  //   // return () => handleDebouncingSearch.cancel();
  // }, [query, handleDebouncingSearch]);
  // Set the form value when initialData changes
  React.useEffect(() => {
    if (initialData && control) {
      // Set the form value to the ID from initialData
      setValue(name, String(initialData.id), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [control]);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Handle scroll event with debounce to prevent multiple calls
        const handleScroll = React.useCallback(
          (e) => {
            if (!onLoadMore || isLoading || isLoadingRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            // If we're close to the bottom (within 5px), load more items
            if (scrollHeight - scrollTop - clientHeight < 5) {
              isLoadingRef.current = true;
              onLoadMore();
              // Reset flag after a delay to prevent rapid firing
              setTimeout(() => {
                isLoadingRef.current = false;
              }, 300);
            }
          },
          [onLoadMore, isLoading, name]
        );

        // Handle wheel events to prevent propagation when over the combobox
        React.useEffect(() => {
          const handleWheel = (e) => {
            if (!commandListRef.current) return;

            // Check if mouse is over the combobox list
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

          // Add the event listener to the window to catch all wheel events
          window.addEventListener("wheel", handleWheel, { passive: false });

          return () => {
            window.removeEventListener("wheel", handleWheel);
          };
        }, [open]);

        // When dropdown opens, check if we need to load items immediately
        React.useEffect(() => {
          if (open && onLoadMore && items.length === 0 && !isLoading) {
            onLoadMore();
          }
        }, [open, onLoadMore, items.length, isLoading, name]);

        // Find selected item safely

        return (
          <FormItem className="space-y-[4px]  mt-2 flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="flex justify-center">
                <div
                  className={cn(
                    "flex w-full h-10 rounded-md border bg-background",
                    "overflow-hidden", // ensures it looks like a single input
                    fieldState.error
                      ? "border-red-500 ring-[0.1] ring-red-500 focus-within:ring-red-500"
                      : "border-input"
                  )}
                >
                  <Popover
                    open={open}
                    onOpenChange={(newOpen) => {
                      setOpen(newOpen);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-full justify-between font-normal h-10 border-t-0 border-l-0 border-b-0 mr-2",
                          style
                        )}
                        type="button" // Prevent form submission on click
                      >
                        {/* {field.value ? (
                      <>
                        {console.log("FIEEEEEEEELD VALUEEEEE", field)}
                        {items.find((item) => {
                          console.log("item", item, field.value);
                          return String(item?.id) === String(field.value);
                        })?.name || field.value.name}
                      </>
                    ) : (
                      <Typography variant="muted">{placeholder}</Typography>
                    )} */}
                        {initialValue !== null ? (
                          <Typography variant="muted">
                            {initialValue?.name?.split("+")[0]}
                          </Typography>
                        ) : (
                          items?.find((item) => {
                            return String(item?.id) === String(field.value);
                          })?.name || (
                            <Typography variant="muted">
                              {placeholder}
                            </Typography>
                          )
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className={cn(
                        "w-[var(--radix-popover-trigger-width)] p-0",
                        className
                      )}
                      align="start"
                    >
                      <Command
                        className="w-full"
                        filter={(value, search) => {
                          // This is the key change - we're providing a custom filter function
                          // that searches based on the item name instead of the value
                          if (!search) return 1;

                          // Find the item with this value
                          const item = items.find(
                            (item) => String(item.id) === value
                          );
                          if (!item) return 0;

                          // Check if the item name includes the search term
                          return item.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0;
                        }}
                      >
                        <CommandInput
                          placeholder={placeholder}
                          onValueChange={(value) => setQuery(value)}
                        />
                        <div
                          ref={commandListRef}
                          className="relative"
                          onWheel={(e) => {
                            // Prevent the wheel event from propagating to parent elements
                            e.stopPropagation();
                          }}
                        >
                          <CommandList
                            // ref={listRef}
                            // onScroll={handleScroll}
                            className="max-h-60 overflow-auto"
                          >
                            {isLoading ? (
                              <>
                                <SpinnerCommon />
                              </>
                            ) : (
                              <>
                                <CommandEmpty>No options found</CommandEmpty>
                                <CommandGroup>
                                  {items.map((item) => (
                                    <CommandItem
                                      key={item.id}
                                      value={String(item.id)}
                                      onSelect={(selectedValue) => {
                                        field.onChange(
                                          selectedValue === field.value
                                            ? ""
                                            : selectedValue
                                        );
                                        setOpen(false);
                                        setInitialValue({
                                          id: item.id,
                                          name: item.name,
                                          phone_code: item.phone_code,
                                        });
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          String(field.value) ===
                                            String(item.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {item.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            )}
                            {isLoading && <SpinnerCommon />}
                          </CommandList>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex-1 flex items-center justify-center  h-10 !rounded-l-none">
                    <div className="flex items-center justify-center">
                      <p className="text-sm text-gray-400">
                        +{initialValue?.phone_code}
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
                        control={control}
                        name={name}
                        value={phoneNoInput}
                        onChange={(e) => {
                          setPhoneNoInput(e.target.value);
                        }}
                        label=""
                        className="!w-full !rounded-l-none !m-0 !border-none !focus-none !outline-none !pl-2"
                        // Add minimum and maximum length attributes
                        // minLength={7}
                        // maxLength={15}
                        showErrorMessage={false}
                        {...props}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export const ComboboxCommon = ({
  control,
  name,
  label,
  items = [],
  placeholder,
  style = "",
  onLoadMore,
  isLoading,
  // handleDebouncingSearch,
  initialData = null,
  className = "",
  dropdDownButton = "",
  handleDropDownButton,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const listRef = React.useRef(null);
  const commandListRef = React.useRef(null);
  const [query, setQuery] = React.useState("");
  // Track if we've initiated loading more items to prevent duplicate requests
  const isLoadingRef = React.useRef(false);
  const [initialValue, setInitialValue] = React.useState(initialData);
  const { setValue } = useFormContext();
  // React.useEffect(() => {
  //   if (query) {
  //     handleDebouncingSearch(query);
  //   }
  //   // return () => handleDebouncingSearch.cancel();
  // }, [query, handleDebouncingSearch]);
  // Set the form value when initialData changes
  React.useEffect(() => {
    if (initialData && control) {
      // Set the form value to the ID from initialData
      setValue(name, String(initialData.id), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [control]);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Handle scroll event with debounce to prevent multiple calls
        const handleScroll = React.useCallback(
          (e) => {
            if (!onLoadMore || isLoading || isLoadingRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            // If we're close to the bottom (within 5px), load more items
            if (scrollHeight - scrollTop - clientHeight < 5) {
              isLoadingRef.current = true;
              onLoadMore();
              // Reset flag after a delay to prevent rapid firing
              setTimeout(() => {
                isLoadingRef.current = false;
              }, 300);
            }
          },
          [onLoadMore, isLoading, name]
        );

        // Handle wheel events to prevent propagation when over the combobox
        React.useEffect(() => {
          const handleWheel = (e) => {
            if (!commandListRef.current) return;

            // Check if mouse is over the combobox list
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

          // Add the event listener to the window to catch all wheel events
          window.addEventListener("wheel", handleWheel, { passive: false });

          return () => {
            window.removeEventListener("wheel", handleWheel);
          };
        }, [open]);

        // When dropdown opens, check if we need to load items immediately
        React.useEffect(() => {
          if (open && onLoadMore && items.length === 0 && !isLoading) {
            onLoadMore();
          }
        }, [open, onLoadMore, items.length, isLoading, name]);

        // Find selected item safely

        return (
          <FormItem className="space-y-[4px] mt-2 flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen);
                }}
              >
                <PopoverTrigger asChild className="">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={fieldState.error ? true : false}
                    className={cn(
                      "w-full justify-between font-normal h-10",
                      fieldState.error &&
                        "border-destructive ring-destructive focus:ring-destructive",
                      style
                    )}
                    type="button"
                  >
                    {initialValue !== null ? (
                      <Typography variant="">{initialValue?.name}</Typography>
                    ) : (
                      (Array.isArray(items) &&
                        items?.find((item) => {
                          return String(item?.id) === String(field.value);
                        })?.name) || (
                        <Typography variant="muted">{placeholder}</Typography>
                      )
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className={cn(
                    "w-[var(--radix-popover-trigger-width)] p-0",
                    className
                  )}
                  align="start"
                >
                  <Command
                    className="w-full"
                    filter={(value, search) => {
                      // This is the key change - we're providing a custom filter function
                      // that searches based on the item name instead of the value
                      if (!search) return 1;

                      // Find the item with this value
                      const item = items.find(
                        (item) => String(item.id) === value
                      );
                      if (!item) return 0;

                      // Check if the item name includes the search term
                      return item.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                        ? 1
                        : 0;
                    }}
                  >
                    <CommandInput
                      placeholder={placeholder}
                      onValueChange={(value) => setQuery(value)}
                    />
                    <div
                      ref={commandListRef}
                      className="relative"
                      onWheel={(e) => {
                        // Prevent the wheel event from propagating to parent elements
                        e.stopPropagation();
                      }}
                    >
                      <CommandList
                        // ref={listRef}
                        // onScroll={handleScroll}
                        className="max-h-60 overflow-auto"
                      >
                        {isLoading ? (
                          <>
                            <SpinnerCommon />
                          </>
                        ) : (
                          <>
                            <CommandEmpty>No options found</CommandEmpty>
                            <CommandGroup>
                              {dropdDownButton && (
                                <CommandItem
                                  onSelect={() => {
                                    setOpen(false);
                                    handleDropDownButton();
                                  }}
                                  className="cursor-pointer"
                                >
                                  {dropdDownButton}
                                </CommandItem>
                              )}
                              {Array.isArray(items) &&
                                items.map((item) => (
                                  <CommandItem
                                    key={item.id}
                                    value={String(item.id)}
                                    onSelect={(selectedValue) => {
                                      field.onChange(
                                        selectedValue === field.value
                                          ? ""
                                          : selectedValue
                                      );
                                      setOpen(false);
                                      setInitialValue({
                                        id: item.id,
                                        name: item.name,
                                      });
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        String(field.value) === String(item.id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {item.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </>
                        )}
                        {isLoading && <SpinnerCommon />}
                      </CommandList>
                    </div>
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
};

export const DatePickerCommon = ({
  control,
  formType = "normal",
  name,
  label = "Date",
  Icon = <CircleAlert color="red" size="20" />,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div
            className={`${
              formType === "card" ? "flex items-center gap-2" : ""
            }`}
          >
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(selectedDate) => {
                      field.onChange(selectedDate);
                      setOpen(false); // Close popover after selection
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          <div className="flex items-center gap-2">
            {fieldState.error ? Icon : null}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
export const CheckboxCommon = ({ control, name, label, placeholder = "" }) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="!mb-[2px]"
              />
            </FormControl>
            <FormLabel className="!mt-0 cursor-pointer !text-sm">
              {label}
            </FormLabel>
          </FormItem>
        )}
      />
    </>
  );
};
// export const FileUploadCommon = ({
//   control,
//   name,
//   accept = "image/jpeg,image/png,application/pdf",
// }) => {
//   const [files, setFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [error, setError] = useState("");
//   const { setValue, setError: setFormError, clearErrors } = useFormContext();
//   const MAX_FILES = 1;

//   // Parse acceptable file types into user-friendly format
//   const acceptedFileTypes = React.useMemo(() => {
//     const typeMap = {
//       "image/jpeg": ".jpg",
//       "image/png": ".png",
//       "application/pdf": ".pdf",
//       "text/csv": ".csv",
//       "application/vnd.ms-excel": ".xls",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
//         ".xlsx",
//       // Add more mappings as needed
//     };

//     return accept
//       .split(",")
//       .map((type) => {
//         const trimmedType = type.trim();
//         return typeMap[trimmedType] || trimmedType;
//       })
//       .join(", ");
//   }, [accept]);

//   useEffect(() => {
//     // For single file upload, we only care about the first successful file
//     const validFile =
//       files.find((file) => file.status === "success")?.file || undefined;

//     // Determine if there's at least one invalid file
//     const hasInvalidFiles = files.some(
//       (file) => file.status === "error" || file.status === "uploading"
//     );

//     // Update the form field with the single valid file
//     setValue(name, validFile, { shouldValidate: true });

//     // Handle form validation
//     if (hasInvalidFiles) {
//       setFormError(name, {
//         type: "manual",
//         message: "Please remove invalid files before submitting",
//       });
//     } else if (!validFile && files.length > 0) {
//       setFormError(name, {
//         type: "manual",
//         message: "A valid file is required",
//       });
//     } else {
//       clearErrors(name);
//     }
//   }, [files, setValue, setFormError, clearErrors, name]);

//   const onDrop = React.useCallback(
//     (acceptedFiles, rejectedFiles) => {
//       if (files.length + acceptedFiles.length > MAX_FILES) {
//         setError(`You can upload a maximum of ${MAX_FILES} file.`);
//         return;
//       }

//       setError("");
//       let newFiles = [];

//       acceptedFiles.forEach((file) => {
//         const fileType = file.type;
//         // Improved check: use more flexible validation
//         const acceptedTypes = accept.split(",").map((type) => type.trim());

//         // Check if the file type is in our accepted list
//         const isValidType = acceptedTypes.some((type) => {
//           // Handle wildcard types like "image/*"
//           if (type.endsWith("/*")) {
//             const mainType = type.split("/")[0];
//             return fileType.startsWith(mainType + "/");
//           }
//           return fileType === type;
//         });

//         if (!isValidType) {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             status: "error",
//             errorMessage: "Unsupported File Type!",
//           });
//         } else if (file.size > 5 * 1024 * 1024) {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             status: "error",
//             errorMessage: "File Size Exceeds 5MB",
//           });
//         } else {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             progress: 0,
//             status: "uploading",
//           });
//           simulateUpload(file.name);
//         }
//       });

//       // Rejected by dropzone itself (e.g. file too large, wrong type)
//       rejectedFiles.forEach((rejected) => {
//         newFiles.push({
//           file: rejected.file,
//           name: rejected.file.name,
//           size: (rejected.file.size / 1024 / 1024).toFixed(1) + " MB",
//           status: "error",
//           errorMessage: rejected.errors[0]?.message || "Unsupported File",
//         });
//       });

//       // Replace existing files (for single file upload)
//       setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//     },
//     [files, accept]
//   );

//   // Simulate file upload progress
//   const simulateUpload = (fileName) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 20;
//       setUploadProgress((prev) => ({
//         ...prev,
//         [fileName]: progress,
//       }));

//       if (progress >= 100) {
//         clearInterval(interval);
//         setFiles((prevFiles) =>
//           prevFiles.map((file) =>
//             file.name === fileName ? { ...file, status: "success" } : file
//           )
//         );
//       }
//     }, 500);
//   };

//   // Remove file from list
//   const removeFile = (fileName) => {
//     setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
//   };

//   // Convert accept string to Dropzone format object
//   const dropzoneAccept = React.useMemo(() => {
//     return accept.split(",").reduce((acc, type) => {
//       const trimmedType = type.trim();
//       acc[trimmedType] = [];
//       return acc;
//     }, {});
//   }, [accept]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: dropzoneAccept,
//     multiple: false,
//     maxSize: 5 * 1024 * 1024, // 5MB
//   });

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field, fieldState }) => (
//         <FormItem className="flex flex-col w-full ">
//           <div
//             {...getRootProps()}
//             className="border border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-gray-500"
//           >
//             <input {...getInputProps()} />
//             <UploadCloud className="h-8 w-8 text-gray-500 mb-2" />
//             <p className="text-gray-700">Upload Document</p>
//             <p className="text-sm text-gray-500">
//               Drag & Drop your file here or{" "}
//               <span className="text-indigo-600 underline">browse a file</span>
//             </p>
//           </div>

//           <div className="flex items-center justify-between gap-2 text-sm">
//             <p>
//               <span className="font-medium">Supported File Type:</span>
//               <span>{acceptedFileTypes}</span>
//             </p>
//             <p>
//               <span className="font-medium">Max File Size:</span>
//               <span>5 MB</span>
//             </p>
//           </div>

//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           {files.length > 0 && (
//             <div className="mt-4 space-y-2">
//               {files.map((file) => (
//                 <motion.div
//                   key={file.name}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className={`flex items-center justify-between p-3 rounded-md border w-full ${
//                     file.status === "error"
//                       ? "border-red-500 bg-red-100"
//                       : file.status === "uploading"
//                       ? "border-yellow-500 bg-yellow-50"
//                       : "border-gray-300 bg-gray-100"
//                   }`}
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{file.name}</p>
//                     <p className="text-xs text-gray-500">{file.size}</p>

//                     {file.status === "error" && (
//                       <p className="text-red-500 text-xs">
//                         {file.errorMessage}
//                       </p>
//                     )}

//                     {file.status === "uploading" && (
//                       <div className="w-full mt-2">
//                         <Progress
//                           value={uploadProgress[file.name] || 0}
//                           className="w-full h-2"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {file.status === "success" && (
//                       <Check className="text-green-600" />
//                     )}
//                     <button type="button" onClick={() => removeFile(file.name)}>
//                       <Trash2 className="text-gray-600 hover:text-red-500" />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}

//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export const FileUploadCommon = ({
//   control,
//   name,
//   accept = "image/jpeg,image/png,application/pdf",
// }) => {
//   const [files, setFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [error, setError] = useState("");
//   const { setValue, setError: setFormError, clearErrors } = useFormContext();
//   const MAX_FILES = 1;
//   useEffect(() => {
//     // 1. Collect only the valid files for the actual form field.
//     const validFiles = files
//       .filter((file) => file.status === "success")
//       .map((file) => file.file);

//     // 2. Determine if there's at least one invalid file.
//     const hasInvalidFiles = files.some(
//       (file) => file.status === "error" || file.status === "uploading"
//     );

//     // 3. Update the form fields:
//     //    - `documentFile`: array of valid File objects
//     setValue(name, validFiles, { shouldValidate: true });

//     // 4. Set form-level validation error if there are invalid files
//     if (hasInvalidFiles) {
//       setFormError(name, {
//         type: "manual",
//         message: "Please remove invalid files before submitting",
//       });
//     } else if (validFiles.length === 0) {
//       setFormError(name, {
//         type: "manual",
//         message: "At least one valid file is required",
//       });
//     } else {
//       clearErrors(name);
//     }

//     // 5. Update the hasInvalidFiles field in the form
//     setValue("hasInvalidFiles", hasInvalidFiles, { shouldValidate: true });
//   }, [files, setValue, setFormError, clearErrors, name]);

//   const onDrop = React.useCallback(
//     (acceptedFiles, rejectedFiles) => {
//       if (files.length + acceptedFiles.length > MAX_FILES) {
//         setError(`You can upload a maximum of ${MAX_FILES} files.`);
//         return;
//       }

//       setError("");
//       let newFiles = [];

//       acceptedFiles.forEach((file) => {
//         const fileType = file.type;
//         const acceptedTypes = accept.split(",");
//         const isValidType = acceptedTypes.some((type) => fileType === type);

//         if (!isValidType) {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             status: "error",
//             errorMessage: "Unsupported File Type!",
//           });
//         } else if (file.size > 5 * 1024 * 1024) {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             status: "error",
//             errorMessage: "File Size Exceeds 5MB",
//           });
//         } else {
//           newFiles.push({
//             file,
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(1) + " MB",
//             progress: 0,
//             status: "uploading",
//           });
//           simulateUpload(file.name);
//         }
//       });

//       // Rejected by dropzone itself (e.g. file too large, wrong type)
//       rejectedFiles.forEach((rejected) => {
//         newFiles.push({
//           file: rejected.file,
//           name: rejected.file.name,
//           size: (rejected.file.size / 1024 / 1024).toFixed(1) + " MB",
//           status: "error",
//           errorMessage: rejected.errors[0]?.message || "Unsupported File",
//         });
//       });

//       setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//     },
//     [files, accept]
//   );

//   // Simulate file upload progress
//   const simulateUpload = (fileName) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 20;
//       setUploadProgress((prev) => ({
//         ...prev,
//         [fileName]: progress,
//       }));

//       if (progress >= 100) {
//         clearInterval(interval);
//         setFiles((prevFiles) =>
//           prevFiles.map((file) =>
//             file.name === fileName ? { ...file, status: "success" } : file
//           )
//         );
//       }
//     }, 500);
//   };

//   // Remove file from list
//   const removeFile = (fileName) => {
//     setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: accept.split(",").reduce((acc, type) => {
//       acc[type] = [];
//       return acc;
//     }, {}),
//     multiple: true,
//     maxSize: 5 * 1024 * 1024, // 5MB
//   });

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field, fieldState }) => (
//         <FormItem className="flex flex-col w-full">
//           <div
//             {...getRootProps()}
//             className="border border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-gray-500"
//           >
//             <input {...getInputProps()} />
//             <UploadCloud className="h-8 w-8 text-gray-500 mb-2" />
//             <p className="text-gray-700">Upload Document</p>
//             <p className="text-sm text-gray-500">
//               Drag & Drop your files here or{" "}
//               <span className="text-indigo-600 underline">browse a file</span>
//             </p>
//           </div>

//           <div className="flex items-center justify-between gap-2 text-sm">
//             <p>
//               <span className="font-medium">Supported File Type:</span>
//               <span>.jpg, .png, .pdf</span>
//             </p>
//             <p>
//               <span className="font-medium">Max File Size:</span>
//               <span>5 MB</span>
//             </p>
//           </div>

//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           {files.length > 0 && (
//             <div className="mt-4 space-y-2">
//               {files.map((file) => (
//                 <motion.div
//                   key={file.name}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className={`flex items-center justify-between p-3 rounded-md border w-full ${
//                     file.status === "error"
//                       ? "border-red-500 bg-red-100"
//                       : file.status === "uploading"
//                       ? "border-yellow-500 bg-yellow-50"
//                       : "border-gray-300 bg-gray-100"
//                   }`}
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{file.name}</p>
//                     <p className="text-xs text-gray-500">{file.size}</p>

//                     {file.status === "error" && (
//                       <p className="text-red-500 text-xs">
//                         {file.errorMessage}
//                       </p>
//                     )}

//                     {file.status === "uploading" && (
//                       <div className="w-full mt-2">
//                         <Progress
//                           value={uploadProgress[file.name] || 0}
//                           className="w-full h-2"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {file.status === "success" && (
//                       <Check className="text-green-600" />
//                     )}
//                     <button type="button" onClick={() => removeFile(file.name)}>
//                       <Trash className="text-gray-600 hover:text-red-500" />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}

//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export const PhoneInputCommon = ({
//   selectedCountry,
//   setSelectedCountry,
//   control,
//   name,
//   label,
//   placeholder,
//   ...props
// }) => {
//   const countries = useSelector((state) => state.commons.countries);
//   const dispatch = useDispatch();

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) =>
//         countries?.isLoading ? (
//           <Skeleton className="h-4 w-full" />
//         ) : (
//           <FormItem>
//             <FormLabel>{label}</FormLabel>
//             <FormControl>
//               <div className="flex custom-input focus-within:border focus-within:border-primary-custom border border-gray-300 rounded-md overflow-hidden">
//                 {/* Country Select */}
//                 <Select
//                   value={selectedCountry?.id} // Use country code as value
//                   onValueChange={(code) => {
//                     const country = countries?.data?.find(
//                       (c) => c.id === Number(code)
//                     );
//                     setSelectedCountry(country);
//                   }}
//                 >
//                   <SelectTrigger className="px-3 py-2 bg-white !border-r !border-l-0 !border-t-0 !border-b-0 w-[5rem] !rounded-r-none">
//                     <SelectValue
//                       placeholder={selectedCountry?.name
//                         .slice(0, 2)
//                         .toLocaleUpperCase()}
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <VirtualizedDropdown data={countries?.data || []} />
//                   </SelectContent>
//                 </Select>

//                 {/* Dialing Code */}
//                 <div className="flex items-center px-3 bg-white text-gray-500">
//                   {/* {selectedCountry.dial_code} */}
//                   +92
//                 </div>

//                 {/* Phone Number Input */}
//                 <input
//                   type="tel"
//                   placeholder={placeholder}
//                   className="flex-1 !border-none !outline-none !ring-0 !focus:ring-0 !focus:border-transparent !focus:outline-none"
//                   {...field}
//                   {...props}
//                 />
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )
//       }
//     />
//   );
// };

export function SearchInputCommon() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([
    {
      id: 1,
      name: "Nathan Ellis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Daniel Vetori",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  // Sample user data
  const allUsers = [
    {
      id: 1,
      name: "Nathan Ellis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Daniel Vetori",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emma Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "James Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Olivia Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "William Jones",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredUsers = allUsers.filter(
      (user) =>
        !selectedUsers.some((selected) => selected.id === user.id) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filteredUsers);
    setShowSuggestions(true);
  }, [searchQuery, selectedUsers]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-base font-medium mb-2 text-gray-700">
        Selects users who can access this business
      </h2>

      <div className="relative" ref={suggestionsRef}>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-4 py-2 w-full border rounded-md"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedUsers.map((user) => (
          <Badge
            key={user.id}
            variant="secondary"
            className="flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-800"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
            <button
              onClick={() => handleRemoveUser(user.id)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export const RadioGroupCommon = ({
  control,
  name,
  label,
  options = [],
  isLoading = false,
  type = "row",
}) => {
  // For row type, use grid with auto rows that stretch
  // For column type, use flex with stretch alignment
  const layoutClasses = type === "row" ? "grid grid-cols-2 gap-4" : "";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className={cn(layoutClasses)}
            >
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="border rounded-md p-4 shadow-sm h-full"
                      >
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))
                : options.map((option) => {
                    const radioId = `radio-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        htmlFor={radioId}
                        className={cn(
                          `block relative border rounded-md p-4 transition-all cursor-pointer hover:border-primary-custom ${
                            type === "row" ? "h-full !mt-0" : "!mt-3"
                          }`,
                          field.value === option.id
                            ? "border-primary-custom bg-primary-custom/5"
                            : "border-border"
                        )}
                      >
                        <div className="flex items-start gap-3 h-full">
                          <RadioGroupItem
                            value={option.id}
                            id={radioId}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-base font-medium">
                              {option.name}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {option?.description || ""}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// export const SearchInputCommon = ({ control, name, label, options }) => {
//   const [open, setOpen] = React.useState(false); // ✅ Track popover open state

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className="flex flex-col w-full">
//           <FormLabel>{label}</FormLabel>
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={open}
//                   className="w-full justify-between"
//                 >
//                   {field.value
//                     ? options.find((item) => item.value === field.value)?.label
//                     : "Select an option..."}
//                   <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent>
//               <Command>
//                 <CommandInput placeholder="Search..." />
//                 <CommandList>
//                   <CommandEmpty>No item found.</CommandEmpty>
//                   <CommandGroup>
//                     {options.map((option) => (
//                       <CommandItem
//                         key={option.value}
//                         value={option.value}
//                         onSelect={() => {
//                           field.onChange(option.value); // Update field value
//                           setOpen(false); // ✅ Close dropdown after selection
//                         }}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             field.value === option.value
//                               ? "opacity-100"
//                               : "opacity-0"
//                           )}
//                         />
//                         {option.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </CommandList>
//               </Command>
//             </PopoverContent>
//           </Popover>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

export const SelectCommon = ({
  control,
  name,
  label,
  items,
  placeholder,
  formType = "normal",
  style = "",
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`${
            formType === "card" ? "flex items-center gap-2" : "space-y-[4px]"
          }`}
        >
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              {...props}
            >
              <SelectTrigger
                className={cn(
                  "cursor-pointer hover:bg-primary-custom/5",
                  style
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="cursor-pointer hover:bg-primary-custom/5"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function ImagePicker({ control, name, label }) {
  const { watch } = useFormContext();

  const [previewImage, setPreviewImage] = useState(watch("logo") || null);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get only the first file
    if (file) {
      // For preview, read the file as Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className="cursor-pointer group relative"
              onClick={triggerFileInput}
            >
              <div className="w-[200px] h-[150px] bg-pink-50 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-red-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                  // Pass only the first file to the form
                  field.onChange(e.target.files[0] || null);
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// export default function ImagePicker({ control, name, label, currentImage }) {
//   // Local state to control the modal and preview image
//   const [open, setOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState(currentImage || null);
//   const [imageUrl, setImageUrl] = useState("");
//   const fileInputRef = useRef(null);

//   const triggerFileInput = () => {
//     fileInputRef.current && fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     if (files.length) {
//       // For preview, still read as Base64
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setPreviewImage(event.target.result);
//       };
//       reader.readAsDataURL(files[0]);
//     }
//   };

//   const handleConfirm = (onChange) => {
//     // Pass the actual FileList to form
//     onChange(fileInputRef.current.files);
//     setOpen(false);
//   };

//   const handleUrlChange = (e) => {
//     setImageUrl(e.target.value);
//   };

//   const handleUrlPreview = () => {
//     if (imageUrl) {
//       setPreviewImage(imageUrl);
//     }
//   };

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           {label && <FormLabel>{label}</FormLabel>}
//           <FormControl>
//             <Dialog open={open} onOpenChange={setOpen}>
//               <DialogTrigger asChild>
//                 <div className="cursor-pointer group relative">
//                   <div className="w-[200px] h-[150px] bg-pink-50 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
//                     {field.value && field.value.length > 0 ? (
//                       // If the form has files, show local preview
//                       <img
//                         src={previewImage || "/placeholder.svg"}
//                         alt="Selected"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       // Otherwise, show an icon or placeholder
//                       <ImageIcon className="w-12 h-12 text-red-400" />
//                     )}
//                   </div>
//                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
//                     <Upload className="w-8 h-8 text-white" />
//                   </div>
//                 </div>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                   <DialogTitle>Choose an image</DialogTitle>
//                 </DialogHeader>
//                 <Tabs defaultValue="upload" className="w-full">
//                   <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="upload">Upload</TabsTrigger>
//                     <TabsTrigger value="url">URL</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="upload" className="space-y-4">
//                     <div className="grid w-full gap-2">
//                       <Label htmlFor="image">Upload Image</Label>
//                       <div
//                         className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
//                         onClick={triggerFileInput}
//                       >
//                         <Upload className="w-10 h-10 text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-500">
//                           Click to upload or drag and drop
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">
//                           SVG, PNG, JPG or GIF (max. 2MB)
//                         </p>
//                         <Input
//                           ref={fileInputRef}
//                           id="image"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleFileChange}
//                         />
//                       </div>
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="url" className="space-y-4">
//                     <div className="grid w-full gap-2">
//                       <Label htmlFor="url">Image URL</Label>
//                       <div className="flex gap-2">
//                         <Input
//                           id="url"
//                           placeholder="https://example.com/image.jpg"
//                           value={imageUrl}
//                           onChange={handleUrlChange}
//                         />
//                         <Button
//                           type="button"
//                           onClick={handleUrlPreview}
//                           size="sm"
//                         >
//                           Preview
//                         </Button>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//                 {previewImage && (
//                   <div className="mt-4">
//                     <Label>Preview</Label>
//                     <div className="mt-2 border rounded-md overflow-hidden w-full h-[200px] flex items-center justify-center">
//                       <img
//                         src={previewImage || "/placeholder.svg"}
//                         alt="Preview"
//                         className="max-w-full max-h-full object-contain"
//                       />
//                     </div>
//                   </div>
//                 )}
//                 <DialogFooter>
//                   <Button variant="outline" onClick={() => setOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={() => handleConfirm(field.onChange)}
//                     disabled={!previewImage}
//                   >
//                     Confirm
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
