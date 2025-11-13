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
                Delivery & Shipping Information
              </h1>
              <p className="text-lg text-slate-700">Here's how our local delivery from Hokaai Meat Market works.</p>
            </div>

            {/* Delivery Areas & Fees */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Delivery Areas & Fees</h2>
              <div className="space-y-4 text-slate-700">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-brand-primary mb-2">0–5 km from Hokaai Meat Market, Faerie Glen</h3>
                  <p>Free delivery on all orders.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-brand-primary mb-2">5–10 km</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Free delivery on orders of R1 000 and above.</li>
                    <li>Orders under R1 000: delivery is charged at R5 per km.</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-brand-primary mb-2">10 km+</h3>
                  <p>
                    Delivery is charged at R5 per km. Exact fees are confirmed with you on WhatsApp before delivery.
                  </p>
                </div>
              </div>
            </section>

            {/* Delivery Times */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Delivery Times</h2>
              <div className="space-y-4 text-slate-700">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-brand-primary mb-2">Standard delivery</h3>
                  <p>Next business day.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-brand-primary mb-2">Speedy delivery</h3>
                  <p>Within 4 hours where available.</p>
                </div>
                <p className="text-sm text-slate-600 mt-4">
                  Exact timing will be confirmed after the order is received.
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

            {/* Notes */}
            <section>
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Notes</h2>
              <div className="space-y-4 text-slate-700">
                <p>Delivery is currently available in and around Pretoria.</p>
                <p>If you're uncertain which delivery option applies to you, please contact us and we'll assist.</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
