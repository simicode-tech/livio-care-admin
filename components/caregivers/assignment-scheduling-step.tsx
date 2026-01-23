"use client";

import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CaregiverFormData } from "./schema";

interface AssignmentSchedulingStepProps {
  form: UseFormReturn<CaregiverFormData>;
}

export function AssignmentSchedulingStep({ form }: AssignmentSchedulingStepProps) {
  const shiftFields = [
    { name: "morning_availability" as const, label: "Morning Shifts", time: "6:00 AM - 2:00 PM" },
    { name: "afternoon_availability" as const, label: "Afternoon Shifts", time: "2:00 PM - 10:00 PM" },
    { name: "night_availability" as const, label: "Night Shifts", time: "10:00 PM - 6:00 AM" }
  ];

  const dayFields = [
    { name: "monday_available" as const, label: "Monday" },
    { name: "tuesday_available" as const, label: "Tuesday" },
    { name: "wednesday_available" as const, label: "Wednesday" },
    { name: "thursday_available" as const, label: "Thursday" },
    { name: "friday_available" as const, label: "Friday" },
    { name: "saturday_available" as const, label: "Saturday" },
    { name: "sunday_available" as const, label: "Sunday" }
  ];

  const handleSelectAllShifts = () => {
    const allSelected = shiftFields.every(field => form.getValues(field.name));
    shiftFields.forEach(field => {
      form.setValue(field.name, !allSelected);
    });
  };

  const handleSelectAllDays = () => {
    const allSelected = dayFields.every(field => form.getValues(field.name));
    dayFields.forEach(field => {
      form.setValue(field.name, !allSelected);
    });
  };

  const allShiftsSelected = shiftFields.every(field => form.watch(field.name));
  const allDaysSelected = dayFields.every(field => form.watch(field.name));

  return (
    <div className="space-y-6">
      {/* Shift Availability */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Shift Availability</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllShifts}
            className="text-sm"
          >
            {allShiftsSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="grid grid-cols-1  gap-4">
          {shiftFields.map((shift) => (
            <FormField
              key={shift.name}
              control={form.control}
              name={shift.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {shift.label}
                    </FormLabel>
                    <p className="text-xs text-gray-500">{shift.time}</p>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Working Days */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Working Days</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllDays}
            className="text-sm"
          >
            {allDaysSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="grid  gap-4">
          {dayFields.map((day) => (
            <FormField
              key={day.name}
              control={form.control}
              name={day.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {day.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}