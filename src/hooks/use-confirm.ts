"use client";

import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

type ConfirmState = Required<ConfirmOptions>;

const DEFAULT_CONFIRM_STATE: ConfirmState = {
  title: "Are you sure?",
  description: "Please confirm that you want to continue.",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "default",
};

export function useConfirm(defaultOptions: ConfirmOptions = {}) {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmState>({
    ...DEFAULT_CONFIRM_STATE,
    ...defaultOptions,
  });

  const finish = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOpen(false);
  }, []);

  const confirm = useCallback(
    (nextOptions: ConfirmOptions = {}) => {
      setOptions({
        ...DEFAULT_CONFIRM_STATE,
        ...defaultOptions,
        ...nextOptions,
      });
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [defaultOptions],
  );

  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    };
  }, []);

  const ConfirmDialog = createElement(
    Dialog,
    {
      open,
      onOpenChange: (nextOpen: boolean) => {
        if (!nextOpen) {
          finish(false);
        }
      },
    },
    createElement(
      DialogContent,
      { className: "sm:max-w-md" },
      createElement(
        DialogHeader,
        null,
        createElement(DialogTitle, null, options.title),
        createElement(DialogDescription, null, options.description),
      ),
      createElement(
        DialogFooter,
        { className: "gap-2 sm:justify-end" },
        createElement(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => finish(false),
          },
          options.cancelText,
        ),
        createElement(
          Button,
          {
            type: "button",
            variant:
              options.variant === "destructive" ? "destructive" : "default",
            onClick: () => finish(true),
          },
          options.confirmText,
        ),
      ),
    ),
  );

  return { confirm, ConfirmDialog };
}
