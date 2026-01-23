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
import { IoEyeSharp } from "react-icons/io5";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { baseReducer } from "@/store";
import useCustomQuery from "@/hooks/useCustomQuery";

const formSchema = z.object({
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
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type Payload = {
  token: string;
  password: string;
}

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

interface Invite {
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  expires_at: string;
}


export default function AcceptInvitePage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  
  // ✅ Get token from URL params
  const params = useParams();
  const token = (params.token as string) || "";
  
  // ✅ Fetch invitation data
  const { data: inviteResponse, isLoading } = useCustomQuery<Invite>(
    { url: token ? `super-admin/public/invitation/${token}/` : "" },
    {
      queryKey: ["accept-invite", token],
      enabled: !!token,
    }
  );
  const invite = inviteResponse;
  
  const { setUser, setToken, setRefreshToken } = baseReducer.getState();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  
  const { mutateAsync, isPending } = useMutate<Response, Payload>({
    type: "post",
    url: "super-admin/invitations/accept-invitation/",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await mutateAsync({
        token: String(token),
        password: values.password,
      });
      setUser(response?.data?.data?.user);
      setToken(response?.data?.data?.access_token);
      setRefreshToken(response?.data?.data?.refresh_token);

      setOpenSuccess(true);
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  // ✅ Show loading state while fetching invitation
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading invitation...</p>
      </div>
    );
  }

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
              Welcome to Livio Care
            </h1>
            <p className="text-[14px] text-[#666666]">
              Kindly enter the details to proceed
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* ✅ Name Field */}
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-[#1A1A1A] block">
                    Name
                  </label>
                  <Input
                    placeholder="Enter Name"
                    type="text"
                    value={invite ? `${invite.first_name} ${invite.last_name}` : ""}
                    disabled
                    className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px]"
                  />
                </div>

                {/* ✅ Email Field */}
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-[#1A1A1A] block">
                    Email Address
                  </label>
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={invite?.email || ""}
                    disabled
                    className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px]"
                  />
                </div>

                {/* ✅ Role Field */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[14px] font-medium text-[#1A1A1A] block">
                    Role
                  </label>
                  <Input
                    placeholder="Role"
                    type="text"
                    value={invite?.role_name || ""}
                    disabled
                    className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px]"
                  />
                </div>

                {/* Password Field */}
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
                              className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPwd((prev) => !prev)}
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
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary block">
                    Confirm Password
                  </label>
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Confirm password"
                              type={showPwd ? "text" : "password"}
                              className="h-[52px] bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-[14px]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPwd((prev) => !prev)}
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
                </div>
              </div>
              
              <Button
                isLoading={isPending}
                type="submit"
                className="w-full h-[52px] text-white text-sm font-medium rounded-lg mt-2"
              >
                Accept Invitation
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent className="max-w-[520px] p-8">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              Welcome to the team!
            </DialogTitle>
            <DialogDescription className="sr-only">
              Invitation accepted successfully
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-6 py-2">
            <Image
              src="/success.gif"
              alt="Success"
              width={140}
              height={140}
              priority
            />

            <p className="text-center text-[16px] text-[#333]">
              You&apos;ve successfully joined as{" "}
              <span className="font-semibold">{invite?.role_name}</span>
            </p>

            <Button
              className="mt-2 w-full h-12 bg-primary text-white font-medium rounded-lg"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}