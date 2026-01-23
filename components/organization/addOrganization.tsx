"use client";

import React from 'react'; 
import { X } from 'lucide-react'; 
import useMutate from "@/hooks/useMutate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { ApiResponseError } from "@/interfaces/axios";
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
import { AxiosError } from 'axios';

interface CustomSideDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const CustomSideDialog: React.FC<CustomSideDialogProps> = ({ title, open, onOpenChange, children, className }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className={`relative bg-white h-full shadow-xl ${className} overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  services_offered: z.array(z.string()).min(1, "Select at least one service"),
  postal_code: z.string().min(1, "Postal code is required"),
  no_of_sites: z.coerce.number().min(0, "Must be 0 or greater"),
  no_of_active_carers: z.coerce.number().min(0, "Must be 0 or greater"),
  no_of_active_clients: z.coerce.number().min(0, "Must be 0 or greater"),
  admin_first_name: z.string().min(1, "First name is required"),
  admin_last_name: z.string().min(1, "Last name is required"),
  admin_email: z.string().email("Invalid email address"),
  admin_phone_number: z.string().min(1, "Phone number is required"),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export default function AddOrganization({addOpen, setAddOpen}: {addOpen: boolean, setAddOpen: (open: boolean) => void}) { 
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending } = useMutate<OrganizationFormValues, OrganizationFormValues>({
    type: "post",
    url: "super-admin/agencies/create/",
  });

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      services_offered: [],
      postal_code: '',
      no_of_sites: 0,
      no_of_active_carers: 0,
      no_of_active_clients: 0,
      admin_first_name: '',
      admin_last_name: '',
      admin_email: '',
      admin_phone_number: ''
    },
  });

  const handleSubmit = async (data: OrganizationFormValues) => { 
    try {
      await mutateAsync(data);
      toast.success("Organization added successfully");
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      setAddOpen(false);
      form.reset();
    } catch (error) {
      const err = error as AxiosError;
      const responseData = err.response?.data;

      if (responseData && typeof responseData === 'object') {
        Object.entries(responseData).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : String(value);
          
          if (key === 'non_field_errors' || key === 'detail' || key === 'message') {
            toast.error(errorMessage);
          } else {
            // Map server-side field errors to form fields
            form.setError(key as keyof OrganizationFormValues, {
              type: "server",
              message: errorMessage,
            });
          }
        });
      } else {
         toast.error("Failed to add organization");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <CustomSideDialog 
        title="Add Organization" 
        open={addOpen} 
        onOpenChange={setAddOpen} 
        className="w-[500px]"
      >
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
                                {service}
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
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
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
              name="no_of_active_carers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Active Carers</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="no_of_active_clients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Active Clients</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter admin email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className='bg-white text-primary hover:bg-gray-100 border-primary'>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}> 
                {isPending ? "Adding..." : "Add"} 
              </Button>
            </div>
          </form>
        </Form>
      </CustomSideDialog>
    </div>
  );
}