"use client";

import React from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmLogoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmLogout({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmLogoutProps) {
  const handleConfirm = () => {
    onConfirm(); // clears amdari_user (auth store)
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-xl border border-gray-200/80 shadow-lg bg-white p-6 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center gap-4">
          <div
            className="flex size-12 items-center justify-center rounded-full border-8 border-[#FAC5C5] bg-[#AA3030] text-white shrink-0"
            aria-hidden
          >
            <LogOut className="size-4" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-bold text-center text-[#092A31] font-clash-display">
              Logout of dashboard.
            </DialogTitle>
            <DialogDescription className="text-sm text-[#64748B] text-center">
              You are about to logout of your consultant dashboard. Are you sure
              you want to logout?
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-3 justify-center sm:justify-center mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg flex-1 h-10 border-[#B6CFD4] bg-[#E8EFF1] text-[#092A31] hover:bg-gray-100 hover:text-[#092A31] px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg flex-1 h-10 bg-[#AA3030] text-white hover:bg-[#AA3030]/90 px-6"
          >
            Yes, logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmLogout;
