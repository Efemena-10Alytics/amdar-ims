"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PersonalInfo from "@/components/_core/auth/sign-up/personal-info";
import CreatePassword from "@/components/_core/auth/sign-up/create-password";
import { useSignUp } from "@/features/auth/use-sign-up";
import ErrorAlert from "@/components/_core/auth/error-alert";
import {
  defaultSignUpFormData,
  type SignUpFormData,
} from "@/components/_core/auth/sign-up/types";
import { ArrowLeft } from "lucide-react";

type SignUpStep = "personal" | "password";

export default function SignUpContent() {
  const searchParams = useSearchParams();
  const { signUp, isSigningUp, errorMessage, clearError } = useSignUp();
  const [step, setStep] = useState<SignUpStep>("personal");
  const [formData, setFormData] = useState<SignUpFormData>(
    defaultSignUpFormData,
  );

  const handleContinue = () => {
    clearError();
    setStep("password");
  };

  const handleSignUpSuccess = () => {
    const redirect = searchParams.get("redirect") ?? undefined;
    const program = searchParams.get("program") ?? undefined;
    signUp(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        location: formData.selectedCountryName,
      },
      redirect,
      program,
    );
  };

  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center pt-4 pr-4 mb-2">
        {step === "password" ? (
          <Button
            variant={"ghost"}
            onClick={() => setStep("personal")}
            className="text-primary/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        ) : (
          <div />
        )}
        {/* <Link href="/auth/sign-in" className="cursor-pointer">
          <Button
            variant="outline"
            className="rounded-md bg-[#C8DDE3] border-[#C8DDE3] text-[#092A31] hover:bg-[#B8CDD3] hover:border-[#B8CDD3] px-6"
          >
            Login
          </Button>
        </Link> */}
      </div>

      <div className="w-full max-w-152 flex-1 mx-auto md:mx-[unset] mt-5">
        <div className="flex items-center gap-10 mb-2 px-6">
          <h1 className="text-2xl font-semibold text-[#092A31]">Sign Up</h1>
          {errorMessage ? <ErrorAlert error={errorMessage} /> : null}
        </div>
        <div className="flex-1 flex items-start px-6 pb-6">
          {step === "personal" ? (
            <PersonalInfo
              formData={formData}
              setFormData={setFormData}
              onContinue={handleContinue}
            />
          ) : (
            <CreatePassword
              formData={formData}
              setFormData={setFormData}
              onSignUpSuccess={handleSignUpSuccess}
              isSigningUp={isSigningUp}
            />
          )}
        </div>
      </div>
    </main>
  );
}
