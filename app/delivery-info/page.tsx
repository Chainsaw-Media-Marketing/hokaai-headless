import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Delivery & Shipping Information | Hokaai Meat Market",
  description: "Learn about our delivery areas, fees, and pickup options for Hokaai Meat Market orders.",
}

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="lg:max-w-[70%] lg:mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-brand-primary mb-4">
                Delivery Information
              </h1>
              <p className="text-lg text-slate-700">Here's how our local delivery from Hokaai Meat Market works.</p>
            </div>

            {/* Section 2 - Pretoria & Centurion */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">
                Pretoria & Centurion (Select Zones Only)
              </h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                <p className="text-slate-700">Orders over R1 500 delivered free in the Pretoria & Centurion area.</p>
                <p className="text-slate-700">
                  Orders under R1 500 in Pretoria & Centurion are charged at a flat rate of R50.
                </p>
                <div className="mt-4 p-4 border rounded bg-opacity-10 text-sm">
                  <p className="font-bold mb-2 text-xs uppercase tracking-wider">Eligible Local Postal Codes:</p>
                  <p className="font-mono">
                    0002 | 0022 | 0042 | 0043 | 0059 | 0060 | 0076 | 0081 | 0083 | 0084 <br />
                    0101 | 0149 | 0154 | 0157 | 0169 | 0181 | 0182 | 0184 | 0186 | 1692
                  </p>
                  <p className="text-xs mt-3 italic opacity-80">
                    *If your delivery postal code is not listed above, your order will automatically route to our
                    Nationwide Courier rate of R200 at checkout.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 - Other Areas */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Other delivery areas</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                <p className="text-slate-700">
                  Deliveries outside Pretoria & Centurion are shipped nationwide via express courier at a fixed flat
                  rate of R200.
                </p>
              </div>
            </section>

            {/* In-Store Pickup */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">In-Store Pickup</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  You're welcome to collect your order in store at Hokaai Meat Market, Hokaai Shopping Centre, 558
                  Graaff-Reinet Street, Faerie Glen, Pretoria.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
