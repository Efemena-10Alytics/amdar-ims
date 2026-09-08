"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useRegisterTreasureHunter,
  type TreasureHunterRegisterPayload,
} from "@/features/treasure-hunt/use-register";

const fieldClassName =
  "h-11 border-transparent bg-[#F8FAFC] px-3 text-sm font-medium text-[#092A31] shadow-none placeholder:text-[#B4C0CC] focus-visible:border-primary focus-visible:ring-primary/15";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-bold text-[#4B5F72]"
    >
      {children}
    </label>
  );
}

function payloadFromForm(formData: FormData): TreasureHunterRegisterPayload {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone_number: String(formData.get("phone_number") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
  };
}

function isPayloadComplete(payload: TreasureHunterRegisterPayload): boolean {
  return Boolean(
    payload.full_name &&
      payload.email &&
      payload.phone_number &&
      payload.address,
  );
}

export default function TreasureHuntRegisterForm() {
  const [clientError, setClientError] = useState("");
  const { register, isSubmitting, errorMessage, data, clearError } =
    useRegisterTreasureHunter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError("");
    clearError();

    const form = event.currentTarget;
    const payload = payloadFromForm(new FormData(form));

    if (!isPayloadComplete(payload)) {
      setClientError("Please fill in all required fields.");
      return;
    }

    try {
      await register(payload);
      form.reset();
    } catch {
      // errorMessage is set by the hook
    }
  };

  if (data) {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0_8px_30px_rgba(15,70,82,0.08)] sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E8F5E9]">
            <Check className="size-7 text-[#2E7D32]" strokeWidth={2.5} />
          </div>
          <h1 className="mt-5 font-clash-display text-2xl font-semibold text-[#092A31] sm:text-3xl">
            Registration successful
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">
            Treasure hunter registered successfully. We&apos;ll be in touch
            shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#0F4652]/10">
          <Gift className="size-7 text-[#0F4652]" />
        </div>
        <h1 className="font-clash-display text-3xl font-semibold text-[#092A31] sm:text-4xl">
          Treasure Hunt Registration
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">
          Fill in your details to join the hunt and claim your treasure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,70,82,0.08)] sm:p-8"
        noValidate
      >
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="full_name">Full name</FieldLabel>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              required
              disabled={isSubmitting}
              className={fieldClassName}
            />
          </div>

          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@amdari.io"
              required
              disabled={isSubmitting}
              className={fieldClassName}
            />
          </div>

          <div>
            <FieldLabel htmlFor="phone_number">Phone number</FieldLabel>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              autoComplete="tel"
              placeholder="+2348000000000"
              required
              disabled={isSubmitting}
              className={fieldClassName}
            />
          </div>

          <div>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <textarea
              id="address"
              name="address"
              rows={3}
              autoComplete="street-address"
              placeholder="12 Admiralty Way, Lekki, Lagos"
              required
              disabled={isSubmitting}
              className={cn(
                fieldClassName,
                "min-h-[5.5rem] w-full resize-y rounded-md py-2.5",
              )}
            />
          </div>
        </div>

        {(clientError || errorMessage) && (
          <p
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            role="alert"
          >
            {clientError || errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-11 w-full bg-[#0F4652] text-white hover:bg-[#0C3640]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Registering…
            </>
          ) : (
            "Register for treasure hunt"
          )}
        </Button>
      </form>
    </section>
  );
}
