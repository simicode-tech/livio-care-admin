"use client";

import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { IoEyeSharp } from "react-icons/io5";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";



const formSchema = z.object({
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
    confirm_password: z.string().min(1, "Please confirm your password"),
})
.refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type Payload = {
    token: string;
    user_id: number | string;
    new_password: string;
};

interface Response {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    requires_2fa: boolean;
    email: string;
  };
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
        new_password: "",
    },
  });
  const { mutateAsync, isPending } = useMutate<Response, Payload>({
    type: "post",
    url: "auth/password-reset/reset/",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle login logic here
    try {
      const response = await mutateAsync({
        token: token || "",
        user_id: userId || "",
        new_password: values.new_password,
      });

      if (response?.data) {
          toast.success(response?.data?.message ?? "Password reset successful");
          router.push("/login");
      } 
    } catch (error) {
      const err = error as ApiResponseError;

      toast.error(err?.response?.data?.message || "Password reset failed");
     
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
              Reset Password
            </h1>
          
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
               
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter password"
                            type={showPwd ? "text" : "password"}
                            className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd((prev: boolean) => !prev)}
                            className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-[#666666]"
                          >
                            {showPwd ? <HiOutlineEyeSlash /> : <IoEyeSharp />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm password"
                            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px] focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
                            {...field}
                          type={showConfirmPwd ? "text" : "password"}
                        />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPwd((prev: boolean) => !prev)}
                            className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-[#666666]"
                          >
                            {showConfirmPwd ? <HiOutlineEyeSlash /> : <IoEyeSharp />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
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
