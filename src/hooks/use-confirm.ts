"use client";

import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
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

  const isDestructive = options.variant === "destructive";
  const iconBorderClassName = isDestructive ? "border-[#FAC5C5]" : "border-[#C2D8FC]";
  const iconBgClassName = isDestructive ? "bg-[#AA3030]" : "bg-primary";
  const confirmButtonClassName = isDestructive
    ? "rounded-lg flex-1 h-10 bg-[#AA3030] text-white hover:bg-[#AA3030]/90 px-6"
    : "rounded-lg flex-1 h-10 bg-primary text-white hover:bg-primary/90 px-6";

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
      {
        className:
          "sm:max-w-md rounded-xl border border-gray-200/80 shadow-lg bg-white p-6 text-center",
        showCloseButton: false,
      },
      createElement(
        DialogHeader,
        { className: "flex flex-col items-center gap-4" },
        createElement(
          "div",
          {
            className: `flex size-12 items-center justify-center rounded-full border-8 ${iconBorderClassName} ${iconBgClassName} text-white shrink-0`,
            "aria-hidden": true,
          },
          createElement(AlertTriangle, { className: "size-4" }),
        ),
        createElement(
          "div",
          { className: "space-y-2" },
          createElement(
            DialogTitle,
            {
              className:
                "text-xl font-bold text-center text-[#092A31] font-clash-display",
            },
            options.title,
          ),
          createElement(
            DialogDescription,
            { className: "text-sm text-[#64748B] text-center" },
            options.description,
          ),
        ),
      ),
      createElement(
        DialogFooter,
        { className: "flex flex-row gap-3 justify-center sm:justify-center mt-6" },
        createElement(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => finish(false),
            className:
              "rounded-lg flex-1 h-10 border-[#B6CFD4] bg-[#E8EFF1] text-[#092A31] hover:bg-gray-100 hover:text-[#092A31] px-6",
          },
          options.cancelText,
        ),
        createElement(
          Button,
          {
            type: "button",
            onClick: () => finish(true),
            className: confirmButtonClassName,
          },
          options.confirmText,
        ),
      ),
    ),
  );

  return { confirm, ConfirmDialog };
}
