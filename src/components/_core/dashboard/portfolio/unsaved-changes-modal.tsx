"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type UnsavedChangesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onLeaveWithoutSaving: () => void;
  onSaveAndLeave: () => void | Promise<void>;
};

export function UnsavedChangesModal({
  open,
  onOpenChange,
  onCancel,
  onLeaveWithoutSaving,
  onSaveAndLeave,
}: UnsavedChangesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-xl border border-gray-200/80 shadow-lg bg-white p-6 text-center"
        // showCloseButton={false}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-center text-[#092A31] font-clash-display">
            You have unsaved changes
          </DialogTitle>
          <DialogDescription className="text-sm text-[#64748B] text-center">
            Save your changes before leaving this section?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
          {/* <Button
            type="button"
            variant="outline"
            className="rounded-lg h-10 border-[#B6CFD4] bg-[#E8EFF1] text-[#092A31] hover:bg-gray-100 hover:text-[#092A31] px-6"
            onClick={onCancel}
          >
            Cancel
          </Button> */}
          <Button
            type="button"
            variant="outline"
            className="rounded-lg h-10 px-6"
            onClick={onLeaveWithoutSaving}
          >
            Leave without saving
          </Button>
          <Button
            type="button"
            className="rounded-lg h-10 bg-primary text-white hover:bg-primary/90 px-6"
            onClick={onSaveAndLeave}
          >
            Save and leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
