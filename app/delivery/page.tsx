export default function DeliveryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Delivery Information</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Fresh meat delivered to your door with our temperature-controlled delivery service.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-8 text-center">Delivery Options</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v0M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m0 0V6a2 2 0 00-2-2H9.414a1 1 0 00-.707.293L7.293 5.707A1 1 0 006.586 6H5a2 2 0 00-2 2v0"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">Free Delivery</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Enjoy free delivery on orders over R500 within our standard delivery areas.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Orders over R500</li>
                  <li>• Within 15km radius</li>
                  <li>• Next-day delivery</li>
                  <li>• Temperature controlled</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">Same-Day Delivery</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Need it today? Same-day delivery available for orders placed before 2 PM.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Orders before 2 PM</li>
                  <li>• R75 delivery fee</li>
                  <li>• Within 10km radius</li>
                  <li>• 4-6 hour window</li>
                </ul>
              </div>
            </div>

            {/* Delivery Areas */}
            <div className="bg-slate-50 rounded-lg p-8 mb-12">
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-6">Delivery Areas</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Free Delivery Areas</h4>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Johannesburg CBD</li>
                    <li>• Sandton</li>
                    <li>• Rosebank</li>
                    <li>• Melville</li>
                    <li>• Parktown</li>
                    <li>• Braamfontein</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Extended Areas (R50 fee)</h4>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Randburg</li>
                    <li>• Fourways</li>
                    <li>• Roodepoort</li>
                    <li>• Bedfordview</li>
                    <li>• Germiston</li>
                    <li>• Kempton Park</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Delivery Process */}
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Place Order</h4>
                  <p className="text-sm text-slate-600">
                    Add items to cart and checkout before our daily cutoff times.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Fresh Preparation</h4>
                  <p className="text-sm text-slate-600">
                    Our butchers prepare your order fresh on the day of delivery.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Temperature Control</h4>
                  <p className="text-sm text-slate-600">
                    Packed in insulated bags with ice packs to maintain freshness.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Safe Delivery</h4>
                  <p className="text-sm text-slate-600">Contactless delivery to your door with SMS notifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-8 text-center">Delivery FAQ</h3>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-2">What are your delivery hours?</h4>
                <p className="text-slate-600">
                  We deliver Monday to Saturday between 9 AM and 6 PM. Sunday deliveries are available for same-day
                  orders placed before 10 AM.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-2">How do you keep meat fresh during delivery?</h4>
                <p className="text-slate-600">
                  All orders are packed in insulated bags with ice packs and delivered in temperature-controlled
                  vehicles to ensure your meat stays fresh and safe.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Can I track my delivery?</h4>
                <p className="text-slate-600">
                  Yes! You'll receive SMS updates when your order is prepared, dispatched, and delivered. Our drivers
                  will also call before arrival.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-2">What if I'm not home for delivery?</h4>
                <p className="text-slate-600">
                  We require someone to be present for delivery due to the perishable nature of our products. We'll call
                  ahead to confirm you're available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
