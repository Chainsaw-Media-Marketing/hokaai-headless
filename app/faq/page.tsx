import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Find answers to common questions about our products, services, and game processing.
              </p>
            </div>
          </div>
        </section>

        {/* Book Your Game Section - Centered */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-6">Book Your Game for Processing</h2>
              <p className="text-lg text-slate-600 mb-8">
                We offer professional game processing services for hunters. Contact us to book your appointment and
                discuss your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:0129912801"
                  className="inline-flex items-center justify-center bg-brand-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Call: 012 991 2801
                </a>
                <a
                  href="mailto:faerieglen@hokaaimeatmarket.co.za"
                  className="inline-flex items-center justify-center bg-slate-200 text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Game Processing Details - 70% Width */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto" style={{ width: "70%" }}>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">
                Game Processing in Pretoria & Centurion
              </h2>

              <div className="space-y-6 mb-12">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 text-xl">Our Game Processing Services</h3>
                  <p className="text-slate-600 mb-4">
                    We provide professional game processing services for hunters in the Pretoria and Centurion areas.
                    Our experienced butchers handle your game with care and expertise.
                  </p>
                  <ul className="text-slate-600 space-y-2 ml-6 list-disc">
                    <li>Professional skinning and cleaning</li>
                    <li>Custom cutting to your specifications</li>
                    <li>Vacuum packing available</li>
                    <li>Biltong and droëwors making</li>
                    <li>Sausage production</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 text-xl">What to Expect</h3>
                  <ul className="text-slate-600 space-y-2 ml-6 list-disc">
                    <li>Booking required - call ahead to schedule your processing</li>
                    <li>Bring your game properly field-dressed and cooled</li>
                    <li>Processing typically takes 2-3 days</li>
                    <li>We'll contact you when your order is ready for collection</li>
                  </ul>
                </div>
              </div>

              <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Game Processing Price List 2025</h2>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Service</th>
                      <th className="text-right py-4 px-6 font-semibold text-slate-900">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Basic Processing (per kg)</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 45.00</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Skinning & Cleaning</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 350.00</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Vacuum Packing (per pack)</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 15.00</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Biltong Making (per kg)</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 180.00</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Droëwors Making (per kg)</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 220.00</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-slate-700">Sausage Making (per kg)</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-medium">R 95.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> Prices are subject to change. Please contact us for a detailed quote based on
                  your specific requirements. Minimum processing charges may apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* General FAQ Section - 70% Width */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto" style={{ width: "70%" }}>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-8 text-center">General Questions</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">What are your store hours?</h4>
                  <p className="text-slate-600">
                    Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 8:00 AM - 4:00 PM, Sunday: 9:00 AM - 1:00 PM
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Do you offer delivery?</h4>
                  <p className="text-slate-600">
                    Yes! We offer free delivery within 5 km, or on orders over R1 000 in Pretoria & Centurion. See our{" "}
                    <a href="/delivery-info" className="text-brand-red hover:underline">
                      delivery information page
                    </a>{" "}
                    for more details.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Can I place custom orders?</h4>
                  <p className="text-slate-600">
                    We specialize in custom orders. Contact us at 012 991 2801 or visit our store to discuss your
                    requirements.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Do you make biltong and droëwors?</h4>
                  <p className="text-slate-600">
                    Yes, we make traditional biltong and droëwors in-house using time-honored recipes. We also offer
                    custom biltong making from your own meat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
