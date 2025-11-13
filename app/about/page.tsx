"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WavyDivider } from "@/components/wavy-divider"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden min-h-[260px] md:min-h-[340px]">
          <div className="absolute inset-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABOUT%20US%20BANNER-RVHllkeOTGwBJoCR5ShqKap57GicUd.png"
              alt="Hokaai Meat Market - Family Legacy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-10 md:py-16 flex items-center min-h-[260px] md:min-h-[340px]">
            <div className="lg:w-[70%] lg:mx-auto">
              <div className="max-w-2xl text-left md:text-left">
                <h1 className="text-white text-3xl md:text-5xl font-semibold mb-4">
                  A Family Legacy of Quality Since 1943
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  Four generations of butchery experience, officially founded in Faerie Glen in 1991.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="lg:w-[70%] lg:mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4 text-body text-foreground/90 leading-relaxed text-center md:text-left">
                  <p>
                    The Hokaai story is built on more than 80 years of family passion for quality meat and honest
                    service.
                  </p>
                  <p>
                    It all began on 30 October 1943, when our great-grandfather began his journey as a butcher — driven
                    by craftsmanship, community, and a belief that every family deserves great meat at fair prices. His
                    dedication laid the foundation for a proud family tradition that continues to this day.
                  </p>
                  <p>
                    Decades later, on 30 October 1991, Johan Roodt moved to Faerie Glen and officially founded Hokaai
                    Meat Market, combining generations of experience with a new vision for modern butchery. From the
                    start, Johan focused on three things — top-quality cuts, best-quality prices, and friendly,
                    down-to-earth service.
                  </p>
                  <p>
                    Today, Hokaai Meat Market Faerie Glen is proudly run by Johan's sons, who continue to honour that
                    legacy. Whether you're after the perfect steak, our famous Watertand Lekker Boerewors™, or a full
                    custom order for an event, Hokaai delivers excellence every time.
                  </p>
                  <p>
                    Embracing the future, Hokaai has expanded beyond the traditional counter with online shopping and
                    home delivery, bringing the same trusted quality and care right to your door.
                  </p>
                  <p>
                    At Hokaai, meat isn't just our business — it's our family's lifelong passion. From our family to
                    yours, we're here to make your butchery dreams come true.
                  </p>
                </div>

                <div className="relative">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABOUT%20US%20SECOND-KNoQc6TOx05m6fv97tNJjfhqThFSRf.png"
                    alt="Premium quality meats from Hokaai"
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <WavyDivider topColor="var(--background)" bottomColor="var(--muted)" height={80} />

        <section className="section-alt py-16">
          <div className="container mx-auto px-4">
            <div className="lg:w-[70%] lg:mx-auto">
              <h2 className="text-h2 text-brand-primary mb-8 text-center">Frequently Asked Questions</h2>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">
                      How long has the Hokaai family been in butchery?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our family's roots in butchery go back to 1943, when our great-grandfather first began working in
                    the trade — starting a tradition of craftsmanship and care that has carried through generations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">When was Hokaai Meat Market founded?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Hokaai Meat Market was officially established on 30 October 1991 by Johan Roodt in Faerie Glen,
                    Pretoria.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">Is Hokaai still family-owned?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes. Hokaai is still proudly family-run, with Johan's sons continuing the legacy today.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">What makes Hokaai's meat special?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We believe in best-quality prices — premium, expertly prepared cuts offered at fair, competitive
                    rates. Every product reflects decades of family expertise.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">What is Watertand Lekker Boerewors™?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    It's our signature, trademarked boerewors recipe — perfected through generations and loved by our
                    customers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">Do you offer custom or bulk orders?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes. We can prepare special cuts, hampers, and event orders. Customers can leave their special
                    requests during checkout.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">Can I shop online?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes — you can order online for delivery or collect from our Faerie Glen store.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-background rounded-lg px-6 border-none">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-foreground">Where are you located?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We're based in Faerie Glen, Pretoria East, serving local customers in-store and delivering across
                    the region.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <WavyDivider topColor="var(--muted)" bottomColor="var(--background)" height={80} />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="lg:w-[70%] lg:mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-red mb-4">Taste the legacy.</h2>
              <p className="text-lg text-foreground/90 mb-8">
                Order your favourite cuts online — same trusted Hokaai quality, now delivered.
              </p>
              <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-white font-semibold px-8">
                <Link href="/collections/butchery">Shop Butchery</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
