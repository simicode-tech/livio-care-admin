"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F5] rounded-lg text-[#666666]">
          <span className={cn(!value && "text-secondary")}>
            {value ? value.toLocaleDateString() : placeholder || "Select date"}
          </span>
          <CalendarIcon className="ml-auto h-5 w-5 text-primary" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}