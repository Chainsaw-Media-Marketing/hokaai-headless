"use client"

import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ProductDeliveryInfo() {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 mt-12">
      <Accordion type="single" collapsible>
        <AccordionItem value="delivery-info" className="group border-b-0">
          <AccordionTrigger className="py-0 items-center rounded-none font-heading font-semibold text-lg text-brand-primary hover:no-underline cursor-pointer data-[state=open]:mb-4 lg:mb-4 lg:cursor-default lg:pointer-events-none lg:[&>svg]:hidden">
            Delivery Information
          </AccordionTrigger>
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
