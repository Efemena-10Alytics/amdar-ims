"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import {
  getBookingLink,
  useBookOfficeHour,
  type BookOfficeHourPayload,
} from "@/features/internship/use-book-office-hour";
import { useAuthStore, type AuthUser } from "@/store/auth-store";
import UserDetails from "./user-details";

type OfficeHourDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked?: (message: string) => void;
};

type OfficeHourFormState = {
  reason: string;
};

const INITIAL_FORM_STATE: OfficeHourFormState = {
  reason: "",
};

const BOOKED_MESSAGE = "Office hour booked successfully.";

type UnknownRecord = Record<string, unknown>;

/** Supports both flat and nested (`{ user: {...} }`) auth user shapes. */
function unwrapUser(user: AuthUser | null | undefined): UnknownRecord | null {
  if (!user || typeof user !== "object") return null;
  const record = user as UnknownRecord;
  const nested = record.user;
  if (nested && typeof nested === "object") return nested as UnknownRecord;
  return record;
}

function readString(source: UnknownRecord | null, ...keys: string[]): string {
  if (!source) return "";
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function resolveFullName(source: UnknownRecord | null): string {
  const direct = readString(source, "fullName", "full_name");
  if (direct) return direct;

  const first = readString(source, "firstName", "first_name", "name");
  const last = readString(source, "lastName", "last_name");
  return [first, last].filter(Boolean).join(" ").trim();
}

const OfficeHourDrawer = ({
  open,
  onOpenChange,
  onBooked,
}: OfficeHourDrawerProps) => {
  const [form, setForm] = useState<OfficeHourFormState>(INITIAL_FORM_STATE);
  const { data: enrollment } = useGetUserEnrollment();
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { submitOfficeHour, isSubmitting, errorMessage, clearError } =
    useBookOfficeHour();

  /** Resets the form on every close, whichever control triggered it. */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(INITIAL_FORM_STATE);
      clearError();
    }
    onOpenChange(nextOpen);
  };

  // Payload is built from the API objects, never from the display strings in
  // UserDetails — those fall back to placeholder copy before data loads.
  const userRecord = unwrapUser(userInfo ?? authUser);
  const fullName = resolveFullName(userRecord);
  const email = readString(userRecord, "email", "emailAddress", "email_address");
  const phone = readString(userRecord, "phoneNumber", "phone_number", "phone");

  const cohortId = enrollment?.cohort?.id ?? enrollment?.cohort_id ?? null;
  const programId = enrollment?.program?.id ?? enrollment?.program_id ?? null;
  const cohortName = enrollment?.cohort?.name?.trim() ?? "";
  const programTitle =
    enrollment?.program?.title?.trim() ||
    enrollment?.program?.intern_title?.trim() ||
    enrollment?.program?.internship_title?.trim() ||
    "";

  const reason = form.reason.trim();
  const payload: BookOfficeHourPayload | null =
    cohortId != null && programId != null && fullName && email && reason
      ? {
          full_name: fullName,
          cohort: cohortName,
          cohort_id: cohortId,
          program: programTitle,
          program_id: programId,
          email,
          phone,
          reasons: reason,
        }
      : null;

  const canSubmit = Boolean(payload) && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload || isSubmitting) return;

    try {
      const response = await submitOfficeHour(payload);
      const link = getBookingLink(response);

      handleOpenChange(false);
      onBooked?.(BOOKED_MESSAGE);

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    } catch {
      // errorMessage is already set by the hook; keep the drawer open.
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 p-0 sm:max-w-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
            <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>
            <SheetTitle className="mt-1 text-xl font-semibold text-[#173740] sm:text-2xl">
              Office hour
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3">
              <label
                htmlFor="office-hour-reason"
                className="mb-1.5 block text-sm font-medium text-[#092A31]"
              >
                Reason for booking this session
              </label>
              <textarea
                id="office-hour-reason"
                value={form.reason}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
                placeholder="Enter reason for booking this session"
                rows={5}
                className={cn(
                  "w-full resize-none rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374]",
                )}
              />
            </div>

            {errorMessage ? (
              <p className="mt-3 text-xs font-medium text-[#C0392B]">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              aria-busy={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Booking…
                </>
              ) : (
                "Book session"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default OfficeHourDrawer;
