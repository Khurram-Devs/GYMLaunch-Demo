'use client'

import { useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'
import { FACILITIES } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { FacilityModal } from '@/components/facility-modal'

export function Facilities() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0, pointerId: 0 })
  const [selected, setSelected] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el) return
    dragState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    const drag = dragState.current
    if (!el || !drag.active) return
    const delta = e.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(delta) < 6) return
      drag.moved = true
      el.setPointerCapture(drag.pointerId)
    }
    el.scrollLeft = drag.scrollLeft - delta
  }

  const endDrag = () => {
    const el = scrollerRef.current
    const drag = dragState.current
    if (drag.moved && el?.hasPointerCapture(drag.pointerId)) el.releasePointerCapture(drag.pointerId)
    drag.active = false
  }

  const openFacility = (index: number) => {
    if (dragState.current.moved) return
    setSelected(index)
    setModalOpen(true)
  }

  return (
    <section className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Space"
            title={
              <>
                A Facility
                <br />
                Designed to Perform
              </>
            }
          />
          <Reveal delay={100}>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
              Five dedicated zones, each purpose-built. Drag to explore the
              space.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Horizontal architectural gallery */}
      <Reveal delay={120} className="mt-14">
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          role="region"
          aria-label="Facility gallery — scroll or drag horizontally"
          tabIndex={0}
          data-lenis-prevent-horizontal
          className="flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 active:cursor-grabbing sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FACILITIES.map((facility, i) => (
            <article
              key={facility.name}
              className="group relative aspect-[3/4] w-[80vw] shrink-0 snap-start overflow-hidden rounded-xl sm:w-[26rem] lg:aspect-[4/5] lg:w-[24rem]"
            >
              <button
                type="button"
                onClick={() => openFacility(i)}
                aria-haspopup="dialog"
                aria-label={`View ${facility.name} larger`}
                className="absolute inset-0 z-10 cursor-[inherit] rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
              />
              <Image
                src={facility.image || '/placeholder.svg'}
                alt={facility.name}
                fill
                draggable={false}
                sizes="(min-width: 1024px) 24rem, 80vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              <span className="absolute left-6 top-6 font-display text-sm font-bold tracking-widest text-accent">
                0{i + 1}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
                  {facility.name}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {facility.caption}
                </p>
              </div>
            </article>
          ))}
          <div className="w-1 shrink-0 sm:w-4" aria-hidden="true" />
        </div>
      </Reveal>

      <FacilityModal
        facility={FACILITIES[selected]}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  )
}
