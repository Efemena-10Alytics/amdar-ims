"use client";

import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ViewLinkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: () => void;
};

export function ViewLinkModal({
  open,
  onOpenChange,
  onContinue,
}: ViewLinkModalProps) {
  const handleContinue = () => {
    onContinue?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader className="flex flex-col items-center text-center sm:block sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2">
            <span className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-primary">
              <Link2 className="size-6" aria-hidden />
            </span>
          </div>
          <DialogTitle>View link</DialogTitle>
          <DialogDescription>
            This link will take you to another site. Do you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
