"use client"

import React from 'react'
import { Check } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type SuccessDialogProps = {
  isOpen: boolean
  onClose: () => void
  source: string
}

const SuccessDialog = ({ isOpen, onClose, source }: SuccessDialogProps) => {
  const normalizedSource = source.toLowerCase()
  const isDataSource = normalizedSource.includes('data')
  const isSocSource = normalizedSource === 'soc' || normalizedSource === 'app-and-cloud-security'

  const whatsappLink = isDataSource
    ? 'https://chat.whatsapp.com/IrSIdYZK8Z62zAtnagRJr4'
    : isSocSource
      ? 'https://chat.whatsapp.com/Bw8Qd8XTuYqCtNK1gVOurH'
      : undefined



  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-[#02090E]/80 backdrop-blur-[2px]"
        className="z-210 w-[min(92vw,500px)]! max-w-[min(92vw,500px)]! rounded-2xl border border-[#2B3A4D] bg-[#121E31] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <h2 className="text-2xl font-semibold text-[#EFF6FB]">Registration Successful!</h2>

        <div className="mx-auto mt-6 flex h-34 w-34 items-center justify-center rounded-full border-2 border-[#22C784]">
          <Check className="h-14 w-14 text-[#22C784]" strokeWidth={2} />
        </div>

        <p className="mx-auto mt-6 max-w-90 text-lg leading-snug text-[#D9E6EC]">
          Thank you for registering! Our team will be in touch with next steps.
        </p>

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-xl bg-[#1E8098] text-lg font-medium text-[#EAF6FA] transition hover:bg-[#2693AD]"
          >
            Join Whatsapp Community
          </a>
        ) : (
          <button
            type="button"
            className="mt-7 h-13 w-full rounded-xl bg-[#1E8098] text-lg font-medium text-[#EAF6FA] transition hover:bg-[#2693AD]"
          >
            Join Whatsapp Community
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
