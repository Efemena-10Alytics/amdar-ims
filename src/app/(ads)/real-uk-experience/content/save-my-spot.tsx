"use client"

import { ChevronDown, X } from 'lucide-react'
import React from 'react'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { useCountries } from '@/features/portfolio/use-countries'
import { useCreateAdsData } from '@/features/ads/use-create-ads-data'
import SuccessDialog from './success-dialog'

type SaveMySpotProps = {
  isOpen: boolean
  onClose: () => void
  region?: string
}

const SaveMySpot = ({ isOpen, onClose, region }: SaveMySpotProps) => {
  const { data: countries = [], isLoading: countriesLoading } = useCountries()
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData()
  const [selectedCountryCode, setSelectedCountryCode] = React.useState('')
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = React.useState('')
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false)
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [formError, setFormError] = React.useState('')


  React.useEffect(() => {
    if (!countries.length) return

    const defaultCountry =
      countries.find((country) => country.name === 'Nigeria') ??
      countries.find((country) => country.name === 'United Kingdom') ??
      countries[0]

    setSelectedCountryCode((prev) => prev || defaultCountry.code)
    setSelectedPhoneCountryCode((prev) => prev || defaultCountry.code)
  }, [countries])

  const selectedPhoneCountry = React.useMemo(
    () => countries.find((country) => country.code === selectedPhoneCountryCode),
    [countries, selectedPhoneCountryCode]
  )
  const selectedCountry = React.useMemo(
    () => countries.find((country) => country.code === selectedCountryCode),
    [countries, selectedCountryCode]
  )

  const resetForm = React.useCallback(() => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setFormError('')
  }, [])

  const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()
    const selectedLocation = selectedCountry?.name ?? ''

    if (!trimmedFirstName || !trimmedEmail || !trimmedPhone || !selectedLocation) {
      setFormError('Please complete all required fields.')
      return
    }

    const phoneWithCode = trimmedPhone.startsWith('+')
      ? trimmedPhone
      : `${selectedPhoneCountry?.callingCode ?? ''}${trimmedPhone}`

    const response = await createNaRole({
      source: region ?? '',
      firstName: trimmedFirstName,
      lastName: trimmedLastName || null,
      email: trimmedEmail,
      location: selectedLocation,
      phone: phoneWithCode,
      visaType: null,
    })

    if (!response) return

    onClose()
    setIsSuccessOpen(true)
    resetForm()
  }, [
    createNaRole,
    email,
    firstName,
    lastName,
    onClose,
    phone,
    region,
    resetForm,
    selectedCountry?.name,
    selectedPhoneCountry?.callingCode,
  ])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-[#02090E]/80 backdrop-blur-[2px]"
          className="z-200  w-[min(92vw,860px)]! max-w-[min(92vw,860px)]! max-h-[96vh] overflow-y-auto rounded-3xl border border-[#2B3A4D] bg-[#121E31] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:p-8"
        >
          <DialogClose
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3B4D66] text-[#C9D6E2] transition hover:bg-[#1A2A3F]"
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </DialogClose>

          <h2 className="text-3xl font-bold text-[#EFF6FB]">Register For Free</h2>
          <p className="mt-1 text-base text-[#94A8BC]">Fill in your appropriate details below</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-base font-medium text-[#EAF1F7]">First name</span>
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-13 w-full rounded-lg border border-[#29384A] bg-[#1A2740] px-4 text-[#EAF1F7] placeholder:text-[#6F8297] outline-none focus:border-[#2C9AB3]" placeholder="Enter your first name" />
              </label>
              <label className="space-y-2">
                <span className="text-base font-medium text-[#EAF1F7]">Last name</span>
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-13 w-full rounded-lg border border-[#29384A] bg-[#1A2740] px-4 text-[#EAF1F7] placeholder:text-[#6F8297] outline-none focus:border-[#2C9AB3]" placeholder="Enter your last name" />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-base font-medium text-[#EAF1F7]">Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-13 w-full rounded-lg border border-[#29384A] bg-[#1A2740] px-4 text-[#EAF1F7] placeholder:text-[#6F8297] outline-none focus:border-[#2C9AB3]" placeholder="Enter your email address" />
            </label>

            <label className="space-y-2 block">
              <span className="text-base font-medium text-[#EAF1F7]">Location (Country)</span>
              <div className="relative">
                <select
                  value={selectedCountryCode}
                  onChange={(event) => {
                    const nextCode = event.target.value
                    setSelectedCountryCode(nextCode)
                    if (!selectedPhoneCountryCode) setSelectedPhoneCountryCode(nextCode)
                  }}
                  className="h-13 w-full appearance-none rounded-lg border border-[#29384A] bg-[#1A2740] px-4 pr-10 text-[#8FA3B8] outline-none focus:border-[#2C9AB3]"
                >
                  <option value="">{countriesLoading ? 'Loading countries...' : 'Select your location'}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9FB0C2]" />
              </div>
            </label>

            <div className="space-y-2">
              <span className="text-base font-medium text-[#EAF1F7]">Phone number</span>
              <div className="grid gap-3 md:grid-cols-[130px_1fr]">
                <div className="relative">
                  <select
                    value={selectedPhoneCountryCode}
                    onChange={(event) => setSelectedPhoneCountryCode(event.target.value)}
                    className="h-13 w-full appearance-none rounded-lg border border-[#29384A] bg-[#1A2740] px-3 pr-8 text-[#EAF1F7] outline-none focus:border-[#2C9AB3]"
                  >
                    <option value="">{countriesLoading ? 'Loading...' : 'Code'}</option>
                    {countries.map((country) => (
                      <option key={`phone-${country.code}`} value={country.code}>
                        {country.callingCode} ({country.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9FB0C2]" />
                </div>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-13 w-full rounded-lg border border-[#29384A] bg-[#1A2740] px-4 text-[#EAF1F7] placeholder:text-[#6F8297] outline-none focus:border-[#2C9AB3]" placeholder="Your phone number" />
              </div>
              {selectedPhoneCountry?.callingCode ? (
                <p className="text-xs text-[#94A8BC]">Selected code: {selectedPhoneCountry.callingCode}</p>
              ) : null}
            </div>
            {formError ? (
              <p className="text-sm text-[#F38A8A]">{formError}</p>
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-[#F38A8A]">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-13 w-full rounded-xl bg-[#1E8098] text-lg font-semibold text-[#EAF6FA] transition hover:bg-[#2693AD]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessDialog isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} source={region!} />
    </>
  )
}

export default SaveMySpot
