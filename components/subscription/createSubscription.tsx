"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CustomSideDialog } from "../ui/custom-side-dialog";
import useMutate from "@/hooks/useMutate";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiResponseError } from "@/interfaces/axios";

interface CreateSubscriptionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const featureSchema = z.object({
  feature_name: z.string().min(1, "Feature name is required"),
  feature_value: z.string().min(1, "Feature value is required"),
});

const subscriptionSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  billing_interval: z.enum(["monthly", "yearly"], {
    required_error: "Billing interval is required",
  }),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export function CreateSubscription({ open, onOpenChange }: CreateSubscriptionProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      billing_interval: "monthly",
      features: [{ feature_name: "", feature_value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const { mutateAsync, isPending } = useMutate<unknown, SubscriptionFormValues>({
    type: "post",
    url: "billing/plans/create/",
  });

  const onSubmit = async (values: SubscriptionFormValues) => {
    try {
      await mutateAsync(values);
      toast.success("Plan created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(
        err.response?.data?.message || "Failed to create plan. Please try again."
      );
    }
  };

  return (
    <CustomSideDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Plan"
      className="w-[600px] h-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Basic Plan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter plan description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Interval</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Features</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[#590054] hover:text-[#590054]/90 hover:bg-purple-50 p-0 h-auto font-normal"
                onClick={() => append({ feature_name: "", feature_value: "" })}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Feature
              </Button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`features.${index}.feature_name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Feature Name (e.g., users)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`features.${index}.feature_value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Value (e.g., 10)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="shrink-0 mt-2"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {form.formState.errors.features?.root && (
              <p className="text-sm text-red-500">
                {form.formState.errors.features.root.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#590054] hover:bg-[#590054]/90 text-white"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Save Plan"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomSideDialog>
  );
}