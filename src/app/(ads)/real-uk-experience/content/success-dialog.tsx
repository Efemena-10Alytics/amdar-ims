"use client"

import React from 'react'
import { Check } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type SuccessDialogProps = {
  isOpen: boolean
  onClose: () => void
  source: string

}

const SuccessDialog = ({ isOpen, onClose, source, }: SuccessDialogProps) => {

  // EU whatsapp links
  const data_WhatsappLinkEU = "https://chat.whatsapp.com/IrSIdYZK8Z62zAtnagRJr4"
  const BA_PM_WhatsappLinkEU = "https://chat.whatsapp.com/IsnI7AG4pPe8Gb7GOJKNa6"
  // This is for App/cloud security GRC SOC LANDING PAGES
  const SOC_WhatsappLinkEU = "https://chat.whatsapp.com/Bw8Qd8XTuYqCtNK1gVOurH"

  // NA whatsapp links
  const BA_PM_WhatsappLinkNA = "https://chat.whatsapp.com/FOMGqwlAB9wKePmDmLStfu"
  const data_WhatsappLinkNA = "https://chat.whatsapp.com/JA7hxEukfq5IrX0u4m3iCO"
  const SOC_WhatsappLinkNA = "https://chat.whatsapp.com/JNa4E24LpaEGBD7Bp6hCuk"




  const whatsappLink = source === SOC_WhatsappLinkEU ? SOC_WhatsappLinkEU
    : source === BA_PM_WhatsappLinkEU ? BA_PM_WhatsappLinkEU
      : source === data_WhatsappLinkEU ? data_WhatsappLinkEU
        : source === BA_PM_WhatsappLinkNA ? BA_PM_WhatsappLinkNA
          : source === data_WhatsappLinkNA ? data_WhatsappLinkNA
            : source === SOC_WhatsappLinkNA ? SOC_WhatsappLinkNA
              : undefined


  console.log('source ==>', source)
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
