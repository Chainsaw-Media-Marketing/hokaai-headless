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

            {/* Section 1 - Free Local Delivery */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Free local delivery</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  Free delivery within 5 km of Hokaai (Faerie Glen), regardless of order value.
                </p>
              </div>
            </section>

            {/* Section 2 - Pretoria & Centurion */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Pretoria & Centurion</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                <p className="text-slate-700">Orders over R1 000 delivered free in the Pretoria & Centurion area.</p>
                <p className="text-slate-700">Orders under R1 000 in Pretoria & Centurion are charged at R5 per km.</p>
              </div>
            </section>

            {/* Section 3 - Other Areas */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Other delivery areas</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                <p className="text-slate-700">Deliveries outside Pretoria & Centurion are charged at R5 per km.</p>
                <p className="text-slate-700">
                  Final delivery cost is confirmed with you after checkout based on your address.
                </p>
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

            {/* Fresh Guarantee Section */}
            <section>
              <h2 className="text-2xl font-heading font-semibold text-brand-primary mb-6">Fresh Guarantee</h2>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  All meat is cut fresh to order and delivered within 24 hours to ensure maximum freshness and quality.
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
