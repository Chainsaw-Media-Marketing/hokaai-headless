"use client"

import Link from "next/link"
import { useId, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PostalCodeCheck } from "@/components/postal-code-check"
import { useDeliveryCheck } from "@/lib/use-delivery-check"
import { cn } from "@/lib/utils"

export function ProductDeliveryInfo() {
  const { status, check } = useDeliveryCheck()
  const [checkOpen, setCheckOpen] = useState(false)
  const [checkKey, setCheckKey] = useState(0)
  const checkSlotId = useId()

  const openCheck = () => {
    setCheckOpen(true)
    setCheckKey((key) => key + 1)
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6 mt-12">
      <Accordion type="single" collapsible>
        <AccordionItem value="delivery-info" className="group border-b-0">
          <div className="group-data-[state=open]:mb-4 lg:mb-4">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3 lg:[&>h3]:flex-1 [&>h3]:min-w-max">
              <AccordionTrigger className="py-0 items-center rounded-none font-heading font-semibold text-lg text-brand-primary hover:no-underline cursor-pointer lg:cursor-default lg:pointer-events-none lg:[&>svg]:hidden">
                Delivery Information
              </AccordionTrigger>
              <button
                type="button"
                onClick={openCheck}
                aria-expanded={checkOpen}
                aria-controls={checkOpen ? checkSlotId : undefined}
                className={cn(
                  "self-start whitespace-nowrap text-left text-xs font-semibold text-brand-primary hover:opacity-80 lg:self-auto lg:min-w-0 lg:whitespace-normal lg:text-right",
                  status === "unknown" && "invisible",
                )}
              >
                {status === "checked" && check ? (
                  <>
                    {`Delivering to ${check.code}${check.local ? " \u2713" : ""} \u00b7 `}
                    <span className="underline underline-offset-4">change</span>
                  </>
                ) : (
                  <span className="underline underline-offset-4">Check your area</span>
                )}
              </button>
            </div>
            {checkOpen && (
              <div id={checkSlotId} className="mt-3">
                <PostalCodeCheck key={checkKey} variant="header" autoFocus />
              </div>
            )}
          </div>
          <AccordionContent
            forceMount
            className="pb-0 text-base group-data-[state=closed]:hidden lg:group-data-[state=closed]:block"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">Local Delivery</h4>
                <p className="text-slate-700">
                  Free delivery on orders over R1 500 in selected Pretoria & Centurion postal codes. R50 flat-rate
                  delivery applies to eligible local orders under R1 500.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">Other Areas</h4>
                <p className="text-slate-700">
                  Nationwide express courier delivery is available at a flat rate of R350. In-store collection is also
                  available.
                </p>
              </div>
            </div>
            <Link
              href="/delivery-info"
              className="inline-block mt-4 font-semibold text-brand-primary underline underline-offset-4 hover:opacity-80"
            >
              View eligible postal codes and full delivery information
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
