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
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IoEyeSharp } from "react-icons/io5";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";

import { baseReducer } from "@/store";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Payload = z.infer<typeof formSchema>;

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

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setEmail, setRefreshToken } =
    baseReducer.getState();
  const [showPwd, setShowPwd] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync, isPending } = useMutate<Response, Payload>({
    type: "post",
    url: "/auth/login/",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle login logic here
    router.push("/dashboard");
    try {
      const response = await mutateAsync(values);

      if (response?.data?.data?.requires_2fa) {
        setEmail(response?.data?.data?.email);
        router.push("/two-auth");
      } else {
        setUser(response?.data?.data?.user);
        setToken(response?.data?.data?.access_token);
        setRefreshToken(response?.data?.data?.refresh_token);
      }
      
    } catch (error) {
      const err = error as ApiResponseError;

      toast.error(err?.response?.data?.message || "Login failed");
      if (err?.response?.status === 401) {
        setEmail(values?.email);
        router.push("/verify");
      }
    }
  };

  return (
    <div className="flex relative h-screen overflow-auto custom-scrollbar">
      <AuthIllustration />
      <div className="h-full flex items-center justify-center w-full bg-white lg:w-1/2">
        <div className="w-full md:max-w-[480px] p-6 md:p-8">
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
              Sign in to your account
            </h1>
            <p className="text-[14px] text-[#666666]">
              Kindly enter the details to get proceed
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary block">
                  Password
                </label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
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
              <div className="flex justify-end ">
                <Link
                  href="/forgot-password"
                  className="primary text-xs underline text-primary font-bold"
                >
                  Forgot password?
                </Link>
              </div>
              </div>
              <Button
                isLoading={isPending}
                type="submit"
                className="w-full h-[52px]  text-white text-sm font-medium rounded-lg mt-2"
              >
                Login
              </Button>
            </form>
          </Form>

          <div className="text-center text-[14px] mt-6">
            <span className="text-[#666666]">Don&apos;t have an account? </span>
            <Link href="/signup" className="primary text-primary font-bold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
