"use client";

import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";

import { baseReducer } from "@/store";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type Payload = z.infer<typeof formSchema>;

interface Response {
  message: string;
  data: {
    email:string;
  };
}

export default function ForgotPage() {
  const router = useRouter();
  const {  setEmail } =
    baseReducer.getState();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutateAsync, isPending } = useMutate<Response, Payload>({
    type: "post",
    url: "auth/password-reset/request-otp/",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle login logic here
    try {
      const response = await mutateAsync(values);

      if (response) {
        toast.success(
          response?.data?.message ??
            "Verification email has been sent your account"
        );
        setEmail(values?.email);
        router.push("/forgot-password/verify");
      }
    } catch (error) {
      const err = error as ApiResponseError;

      toast.error(err?.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="flex relative h-screen overflow-auto custom-scrollbar">
      <AuthIllustration />
      <div className="h-full flex items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-[480px] p-6 md:p-8">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="Livio Care Logo"
              width={120}
              height={40}
              priority
            />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">
             Forgot password
            </h1>
            <p className="text-[14px] text-[#666666]">
              Kindly enter the email to reset your password
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-[#1A1A1A] block">
                  Email Address
                </label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          type="email"
                          className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                isLoading={isPending}
                type="submit"
                className="w-full h-[52px]  text-white text-sm font-medium rounded-lg mt-2"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
