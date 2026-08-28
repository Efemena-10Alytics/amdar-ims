"use client";

import { useMutation } from "@tanstack/react-query";
import { submitDefermentRequest } from "@/features/deferment/submit-deferment";
import type { SubmitDefermentPayload } from "@/types/deferment";

export function useSubmitDeferment() {
  return useMutation({
    mutationFn: (payload: SubmitDefermentPayload) =>
      submitDefermentRequest(payload),
  });
}
