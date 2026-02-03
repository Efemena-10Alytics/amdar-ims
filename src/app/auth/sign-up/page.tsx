"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PersonalInfo from "@/components/_core/auth/sign-up/personal-info";
import CreatePassword from "@/components/_core/auth/sign-up/create-password";
import { useRouter } from "next/navigation";

type SignUpStep = "personal" | "password";

const SignUp = () => {
  const [step, setStep] = useState<SignUpStep>("personal");
  const router = useRouter();

  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col">
      <div className="flex justify-end p-6">
        <Link href="/auth/sign-in" className="cursor-pointer">
          <Button
            variant="outline"
            className="rounded-md bg-[#C8DDE3] border-[#C8DDE3] text-[#092A31] hover:bg-[#B8CDD3] hover:border-[#B8CDD3] px-6"
          >
            Login
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-120">
        <div className="flex items-center gap-10 mb-2 px-6">
          <h1 className="text-2xl font-semibold text-[#092A31]">Sign Up</h1>
        </div>
        <div className="flex-1 flex items-start px-6 pb-6">
          {step === "personal" ? (
            <PersonalInfo onContinue={() => setStep("password")} />
          ) : (
            <CreatePassword onSignUpSuccess={() => router.push("/auth/otp")} />
          )}
        </div>
      </div>
    </main>
  );
};

export default SignUp;
