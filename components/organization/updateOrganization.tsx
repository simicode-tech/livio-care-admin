"use client";

import React, { useEffect } from 'react';
import useMutate from "@/hooks/useMutate";
import useCustomQuery from "@/hooks/useCustomQuery";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CustomSideDialog } from "@/components/ui/custom-side-dialog";
import { AxiosError } from 'axios';

type OrganizationDetail = {
    "id": string,
    "agency_name": string,
    "primary_email":string,
    "agency_type": string[],
    "address":string,
    "plan_name": string,
    "status":string,
    "total_caregivers":number,
    "total_clients":number,
    "date_joined":string,
    "last_login":string,
    "last_subscription_payment_date": string,
    "is_suspended": boolean
}

const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  services_offered: z.array(z.string()).min(1, "Select at least one service"),
  no_of_sites: z.coerce.number().min(0, "Must be 0 or greater"),
  is_suspended: z.boolean(),
});

type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;

interface UpdateOrganizationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizationId: string | null;
}

export default function UpdateOrganization({ open, setOpen, organizationId }: UpdateOrganizationProps) {
  const queryClient = useQueryClient();

  const { data: agencyData, isLoading } = useCustomQuery<OrganizationDetail>({
    url: `super-admin/agencies/${organizationId}/`,
  }, {
    queryKey: ["agency-details", organizationId],
    enabled: !!organizationId && open,
  });
  console.log(agencyData);
  

  const { mutateAsync, isPending } = useMutate<OrganizationDetail, UpdateOrganizationFormValues>({
      type: "patch",
    url: `super-admin/agencies/${organizationId}/edit/`,
  });

  const form = useForm<UpdateOrganizationFormValues>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: '',
      services_offered: [],
      no_of_sites: 0,
      is_suspended: false,
    },
  });

useEffect(() => {
    if (agencyData) {
        const data = agencyData;
        
        // Check if agency_type is an array, otherwise create a default array
        const services = Array.isArray(data.agency_type) 
            ? data.agency_type 
            : (data.agency_type ? [data.agency_type] : []);
        
        form.reset({
            name: data.agency_name || '',
            services_offered: services,
            no_of_sites: data.total_clients || 0,
            is_suspended: data.is_suspended || false,
        });
    }
}, [agencyData, form]);
  const handleSubmit = async (data: UpdateOrganizationFormValues) => {
    try {
      await mutateAsync(data);
      toast.success("Organization updated successfully");
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      queryClient.invalidateQueries({ queryKey: ["agency-details", organizationId] });
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError
        const responseData = err?.response?.data;
        if (responseData && typeof responseData === 'object') {
             Object.entries(responseData).forEach(([key, value]) => {
                const errorMessage = Array.isArray(value) ? value[0] : String(value);
                 if (key === 'non_field_errors' || key === 'detail' || key === 'message') {
                    toast.error(errorMessage);
                 } else {
                    form.setError(key as keyof UpdateOrganizationFormValues, {
                        type: "server",
                        message: errorMessage,
                    });
                 }
             });
        } else {
             toast.error("Failed to update organization");
        }
    }
  };

  return (
    <CustomSideDialog
      title="Update Organization"
      open={open}
      onOpenChange={setOpen}
      className="w-[500px]"
    >
      {isLoading ? (
          <div className="flex items-center justify-center h-40">Loading...</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services_offered"
              render={() => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <div className="space-y-2">
                    {["residential", "domiciliary"].map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="services_offered"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, service])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {service.replace('_', ' ')}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="no_of_sites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sites</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of sites" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_suspended"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Suspended</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Suspend this organization
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className='bg-white text-primary hover:bg-gray-100 border-primary'>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </CustomSideDialog>
  );
}