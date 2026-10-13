'use client'

import Image from 'next/image'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import type { Facility } from '@/lib/data'

export function FacilityModal({
  facility,
  open,
  onOpenChange,
}: {
  facility: Facility
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <Dialog.Popup className="relative flex max-h-[92svh] w-full max-w-[min(40rem,calc(92svh-7rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_140px_-30px_rgba(0,0,0,0.95)] outline-none transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] data-starting-style:translate-y-4 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:translate-y-4 data-ending-style:scale-95 data-ending-style:opacity-0">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            />

            <Dialog.Close
              aria-label="Close"
              className="absolute right-3.5 top-3.5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-background/60 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>

            <div className="relative aspect-square w-full shrink-0 bg-muted">
              <Image
                src={facility.image}
                alt={facility.name}
                fill
                sizes="(min-width: 640px) 40rem, 100vw"
                className="object-cover"
              />
            </div>

            <div className="px-5 pb-6 pt-5 sm:px-7">
              <Dialog.Title className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
                {facility.name}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {facility.caption}
              </Dialog.Description>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
