"use client";

import { Button } from "@/components/ui/button";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";

import { baseReducer } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface Response {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message: string;
}

interface Payload {
  email: string;
  password: string;
  otp: string;
}
export default function VerificationPage() {
  const {
    setUser,
    setToken,
    email,
    setEmail,
    setPassword,
    password,
    setRefreshToken,
  } = baseReducer.getState();
  const [code, setCode] = useState(["", "", "", "", "",""]);
  const [countdown, setCountdown] = useState(90); // 1min 30sec in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutate<Response, Payload>({
    type: "post",
    url: "auth/login/2fa/",
  });
  const resendMutation = useMutate<Response, { email: string }>({
    type: "post",
    url: "auth/resend-verification/",
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendCode = async () => {
    try {
      // Simulate API call
      const response = await resendMutation.mutateAsync({ email: `${email}` });

      setCanResend(false);
      toast.success(
        response?.data?.message ?? "Verification code resent to your email"
      );
      setCountdown(90);
    } catch (error) {
      const err = error as ApiResponseError;
      console.log(error);
      toast.error(
        err?.response?.data?.message ?? "Resend failed. Please try again."
      );
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.info("Please enter the complete verification code");
      return;
    }

    try {
      // Simulate API call
      const response = await mutateAsync({
        email,
        password,
        otp: verificationCode,
      });
      setToken(response?.data?.data?.access_token);
      setRefreshToken(response?.data?.data?.refresh_token);
      setUser(response?.data?.data?.user);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      const err = error as ApiResponseError;

      toast.error(
        err?.response?.data?.message ?? "Verification failed. Please try again."
      );
    }
  };

  return (
    <div className="flex relative h-screen overflow-auto custom-scrollbar">
      <div className="h-screen sticky rounded-tr-3xl bg-[#FDF7FA] w-1/2 hidden lg:flex"></div>
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
              Verify your account
            </h1>
            <p className="text-[14px] text-[#666666]">
              Kindly enter the code sent to your inbox.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null): void => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-semibold bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:ring-1 focus:ring-[#4C1D95] focus:border-[#4C1D95]"
              />
            ))}
          </div>

          <div className="flex justify-between items-center text-sm mb-8">
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="text-[#4C1D95] font-medium hover:underline"
              >
                Resend code
              </button>
            ) : (
              <div className="text-[#666666]">
                Resend code in {formatTime(countdown)}
              </div>
            )}
            <button
              onClick={() => router.push("/signup")}
              className="text-[#666666] hover:text-[#4C1D95]"
            >
              Change email address
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || code.length < 6}
            isLoading={isPending}
            className="w-full h-[48px]  text-white text-sm font-medium rounded-lg"
          >
            Submit
          </Button>
        </div>
      </div>

      <LoadingDialog open={isPending} message="Verifying..." />
    </div>
  );
}
