"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";
import { ServiceTypes } from "@/lib/config";
import { useSetEmail } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface PostcodesIoResponse {
  status: number;
  result: {
    postcode: string;
    quality: number;
    eastings: number;
    northings: number;
    country: string;
    nhs_ha: string;
    longitude: number;
    latitude: number;
    european_electoral_region: string;
    primary_care_trust: string;
    region: string;
    lsoa: string;
    msoa: string;
    incode: string;
    outcode: string;
    parliamentary_constituency: string;
    admin_district: string;
    parish: string;
    admin_county: string;
    admin_ward: string;
    ced: string;
    ccg: string;
    nuts: string;
    codes: {
      admin_district: string;
      admin_county: string;
      admin_ward: string;
      parish: string;
      parliamentary_constituency: string;
      ccg: string;
      ccg_id: string;
      ced: string;
      nuts: string;
      lsoa: string;
      msoa: string;
      lau2: string;
    };
  };
}

const signUpSchema = z.object({
  // Step One Fields - Personal Information
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Invalid mobile number"),
  agency_name: z.string().min(1, "Service name is required"),

  // Step Two Fields - Address & Location
  postal_code: z.string().min(1, "Service postcode is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),

  // Step Three Fields - Service Details & Password
  services_offered: z
    .array(z.string())
    .min(1, "Please select at least one service"),
  no_of_sites: z.string().min(1, "Number of sites is required"),
  no_of_active_clients: z
    .string()
    .refine((val) => ["10", "20", "50", "100", "500", "500+"].includes(val), {
      message: "Please select number of service users",
    }),
  no_of_active_carers: z
    .string()
    .min(1, "Please select number of carers")
    .refine((val) => ["10", "20", "50", "100", "500", "500+"].includes(val), {
      message: "Please select a valid number of carers",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type SignUpPayload = z.infer<typeof signUpSchema>;

interface SignUpResponse {
  data: {
    agency_name: string;
    services_offered: string[];
    email: string;
  };
}

// Step schemas for validation
const stepOneSchema = signUpSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  phone_number: true,
  agency_name: true,
});

const stepTwoSchema = signUpSchema.pick({
  postal_code: true,
  address: true,
  city: true,
  county: true,
});

const stepThreeSchema = signUpSchema
  .pick({
    services_offered: true,
    no_of_sites: true,
    no_of_active_clients: true,
    no_of_active_carers: true,
    password: true,
  })
  .extend({
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [postcodeData, setPostcodeData] = useState<
    PostcodesIoResponse["result"] | null
  >(null);
  const [isValidatingPostcode, setIsValidatingPostcode] = useState(false);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const router = useRouter();
  const setEmail = useSetEmail();

  // Store form data from previous steps
  const [stepOneFormData, setStepOneFormData] = useState<z.infer<
    typeof stepOneSchema
  > | null>(null);
  const [stepTwoFormData, setStepTwoFormData] = useState<z.infer<
    typeof stepTwoSchema
  > | null>(null);

  // Form instances for each step
  const stepOneForm = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      agency_name: "",
    },
  });

  const stepTwoForm = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      postal_code: "",
      address: "",
      city: "",
      county: "",
    },
  });

  const stepThreeForm = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      services_offered: [],
      no_of_sites: "",
      no_of_active_clients: "",
      no_of_active_carers: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutateAsync, isPending } = useMutate<SignUpResponse, SignUpPayload>({
    type: "post",
    url: "/auth/agency-signup/",
  });

  // Step submission handlers
  const onStepOneSubmit = (values: z.infer<typeof stepOneSchema>) => {
    setStepOneFormData(values);
    setStep(2);
  };

  const onStepTwoSubmit = (values: z.infer<typeof stepTwoSchema>) => {
    setStepTwoFormData(values);
    setStep(3);
  };

  const validatePostcode = useCallback(async (postcode: string) => {
    if (!postcode || postcode.length < 5) {
      setPostcodeData(null);
      setPostcodeValid(null);
      return;
    }

    setIsValidatingPostcode(true);
    try {
      const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(
          cleanPostcode
        )}`
      );

      if (response.ok) {
        const data: PostcodesIoResponse = await response.json();
        setPostcodeData(data.result);
        setPostcodeValid(true);

        // Auto-fill city/county from postcode data
        stepTwoForm.setValue("city", data.result.admin_district || "");
        stepTwoForm.setValue("county", data.result.admin_county || "");

        toast.success("Valid postcode! Please enter your address details.");
      } else {
        setPostcodeData(null);
        setPostcodeValid(false);
        toast.error("Invalid postcode. Please check and try again.");
      }
    } catch (error) {
      console.error("Postcode validation error:", error);
      setPostcodeData(null);
      setPostcodeValid(false);
      toast.error("Error validating postcode");
    } finally {
      setIsValidatingPostcode(false);
    }
  }, [stepTwoForm]);

  useEffect(() => {
    const subscription = stepTwoForm.watch((value, { name }) => {
      if (name === "postal_code" && value.postal_code) {
        const timeoutId = setTimeout(() => {
          validatePostcode(value?.postal_code ?? "");
        }, 800); // Debounce for 800ms

        return () => clearTimeout(timeoutId);
      }
    });

    return () => subscription.unsubscribe();
  });

  const onStepThreeSubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    try {
      const { confirm_password, ...stepThreeData } = values;
      console.log(confirm_password);
      if (stepOneFormData !== null && stepTwoFormData !== null) {
        const payload = {
          ...stepOneFormData,
          ...stepTwoFormData,
          ...stepThreeData,
        };

        const response = await mutateAsync(payload);
        setEmail(response?.data?.data?.email);
        router.push("/verify");
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(
        err?.response?.data?.errors
          ? JSON.stringify(err?.response?.data?.errors[0])
          : err?.response?.data?.message || "Sign up failed"
      );
    }
  };

  // Navigation functions
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex relative h-screen overflow-auto custom-scrollbar">
      <AuthIllustration />
      <div className="min-h-screen flex items-center justify-center pt-20 bg-white lg:w-1/2">
        <div className="w-full max-w-[480px] mx-auto p-6 md:px-8 pb-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Livio Care Logo"
              width={120}
              height={40}
              priority
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
              Create an account
            </h1>
            <p className="text-sm text-[#666666]">
              Sign up to discover more about the Livio Care management platform
            </p>
          </div>

          <div className="bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg mx-auto w-fit mb-5">
            Step {step} of 3
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-5 duration-300">
              <Form {...stepOneForm}>
                <form
                  key={1}
                  onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A] block">
                        First Name
                      </label>
                      <FormField
                        control={stepOneForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[12px] mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A] block">
                        Last Name
                      </label>
                      <FormField
                        control={stepOneForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A] block">
                        Work Email Address
                      </label>
                      <FormField
                        control={stepOneForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter work email address"
                                type="email"
                                className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A] block">
                        Mobile Number
                      </label>
                      <FormField
                        control={stepOneForm.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter mobile number"
                                type="tel"
                                className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={stepOneForm.control}
                    name="agency_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Service Name
                        </FormLabel>
                        <FormDescription className="text-xs text-gray-500">
                          Best describes the setting your team delivers care
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="Enter service name"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-sm font-medium rounded-lg"
                  >
                    Next
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Address & Location Details */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-5 duration-300">
              <Form {...stepTwoForm}>
                <form
                  key={2}
                  onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={stepTwoForm.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Service Postcode
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter service postcode (e.g., SW1A 1AA)"
                              className={`bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95] ${
                                postcodeValid === true
                                  ? "border-green-500"
                                  : postcodeValid === false
                                  ? "border-red-500"
                                  : ""
                              }`}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setPostcodeValid(null);
                              }}
                            />
                            {isValidatingPostcode && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4C1D95]"></div>
                              </div>
                            )}
                            {postcodeValid === true && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="text-green-500">✓</div>
                              </div>
                            )}
                            {postcodeValid === false && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="text-red-500">✗</div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                        {postcodeData && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ Valid postcode in {postcodeData.admin_district},{" "}
                            {postcodeData.country}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepTwoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Address Line 1
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter house number and street name"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepTwoForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          City/Town
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city or town"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepTwoForm.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          County (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter county"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="w-full"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-full text-sm font-medium rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 3: Service Details & Password */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-5 duration-300">
              <Form {...stepThreeForm}>
                <form
                  key={3}
                  onSubmit={stepThreeForm.handleSubmit(onStepThreeSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={stepThreeForm.control}
                    name="services_offered"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-sm font-medium">
                            Services Offered
                          </FormLabel>
                          <FormDescription className="text-xs text-gray-500">
                            Select all services that your agency provides
                          </FormDescription>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {ServiceTypes.map((service) => (
                            <FormField
                              key={service.id}
                              control={stepThreeForm.control}
                              name="services_offered"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={service.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          service.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                service.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== service.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {service.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepThreeForm.control}
                    name="no_of_sites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Number of Sites
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter number of sites"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={stepThreeForm.control}
                      name="no_of_active_clients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Number of Service Users
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]">
                                <SelectValue placeholder="Select number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">1-10</SelectItem>
                              <SelectItem value="20">11-20</SelectItem>
                              <SelectItem value="50">21-50</SelectItem>
                              <SelectItem value="100">51-100</SelectItem>
                              <SelectItem value="500">101-500</SelectItem>
                              <SelectItem value="500+">500+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={stepThreeForm.control}
                      name="no_of_active_carers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Number of Carers
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]">
                                <SelectValue placeholder="Select number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">1-10</SelectItem>
                              <SelectItem value="20">11-20</SelectItem>
                              <SelectItem value="50">21-50</SelectItem>
                              <SelectItem value="100">51-100</SelectItem>
                              <SelectItem value="500">101-500</SelectItem>
                              <SelectItem value="500+">500+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={stepThreeForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepThreeForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirm password"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="w-full"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isPending}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
