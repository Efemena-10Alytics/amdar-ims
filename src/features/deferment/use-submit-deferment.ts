"use client";

import { useMutation } from "@tanstack/react-query";
import {
  submitDefermentRequest,
  type DefermentFormPayload,
} from "@/features/deferment/submit-deferment";

export function useSubmitDeferment() {
  return useMutation({
    mutationFn: (payload: DefermentFormPayload) =>
      submitDefermentRequest(payload),
  });
}
