"use client";

import * as React from "react";
import { useController, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock as ClockIcon } from "lucide-react";

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
