import React from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileDrawerProps {
  isDrawerOpen: boolean
  onClose: () => void
  navLinks: Array<{ label: string; href: string }>
}

const MobileDrawer = ({ isDrawerOpen, onClose, navLinks }: MobileDrawerProps) => {
  return (
    <>
      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-60 transform transition-transform duration-300 ease-in-out lg:hidden",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-[#156374]">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-[#156374] hover:text-[#0f4d5a] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="text-base font-medium text-[#156374] hover:text-[#0f4d5a] transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Drawer Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onClose}
                className={cn(
                  "w-full border-[#156374] text-[#156374] bg-white hover:bg-[#156374]/5",
                  "hover:border-[#0f4d5a] hover:text-[#0f4d5a]",
                )}
              >
                Login
              </Button>
              <Button
                onClick={onClose}
                className={cn(
                  "w-full bg-[#156374] text-white hover:bg-[#0f4d5a]",
                  "border-0",
                )}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileDrawer
