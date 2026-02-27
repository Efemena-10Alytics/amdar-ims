"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/447478036553";

const ASSISTANCE_OPTIONS = [
  "Internship program",
  "Plan & pricing",
  "Project vault",
  "Session booking",
  "Interview prep",
  "Privacy & policy",
  "Others",
] as const;

export interface WhatsAppWidgetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger element (e.g. a button). If not provided, use controlled open only. */
  trigger?: React.ReactNode;
}

export function WhatsAppWidget({
  open,
  onOpenChange,
  trigger,
}: WhatsAppWidgetProps) {
  const content = (
    <DialogContent
      showCloseButton={true}
      overlayClassName="bg-transparent"
      className="!left-auto !translate-x-0 fixed right-[40px] top-1/2 -translate-y-1/2 w-[320px] sm:w-[360px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] h-auto rounded-xl  border  border-white/10 bg-[#15535E] text-white shadow-xl overflow-y-auto p-0 gap-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-90 [&_[data-slot=dialog-close]]:hover:bg-white/20 [&_[data-slot=dialog-close]]:hover:opacity-100"
    >
      <DialogTitle className="sr-only">Chat with us on WhatsApp</DialogTitle>
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              Chat with us on whatsapp
            </h3>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-white/80 text-sm">
            Select area where you need our assistance
          </p>
          <div className="flex -space-x-2 mt-3 justify-end">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#15535E]"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* List of options */}
      <div className="px-4 pb-4 space-y-1">
        {ASSISTANCE_OPTIONS.map((option) => (
          <a
            key={option}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-3 px-4 transition-colors"
          >
            {option}
          </a>
        ))}
      </div>

      {/* Continue button */}
      <div className="p-4 pt-0">
        <Button
          className="w-full rounded-lg bg-amdari-yellow text-[#092A31] hover:bg-amdari-yellow/90 font-semibold h-11"
          onClick={() => onOpenChange?.(false)}
          asChild
        >
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Continue
          </a>
        </Button>
      </div>
    </DialogContent>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      {trigger != null && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {content}
    </Dialog>
  );
}

export default WhatsAppWidget;
