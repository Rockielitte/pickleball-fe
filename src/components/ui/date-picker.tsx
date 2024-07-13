"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DatePicker = forwardRef<
  HTMLDivElement,
  {
    date?: Date;
    setDate: (date?: Date) => void;
    disabled?: boolean;
    disabledFromNow?: boolean;
    disabledFromPast?: number;
  }
>(function DatePickerCmp(
  { date, setDate, disabled, disabledFromNow, disabledFromPast },
  ref
) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" ref={ref}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(dateTime) => {
            if (disabledFromNow && dateTime < new Date()) {
              return true;
            }
            if (disabledFromPast && dateTime < new Date(Date.now())) {
              return true;
            }
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
});
