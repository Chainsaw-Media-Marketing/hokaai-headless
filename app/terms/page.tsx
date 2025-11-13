export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: January 2024</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing and using the Hokaai Meat Market website and services, you accept and agree to be bound by
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Product Information</h2>
              <p className="text-slate-600 mb-4">
                We strive to provide accurate product descriptions and pricing. However, we reserve the right to correct
                any errors, inaccuracies, or omissions and to change or update information at any time without prior
                notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Orders and Payment</h2>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• All orders are subject to acceptance and availability</li>
                <li>• Payment must be made at the time of ordering</li>
                <li>• We accept major credit cards and EFT payments</li>
                <li>• Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Delivery Terms</h2>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• Delivery times are estimates and not guaranteed</li>
                <li>• Someone must be present to receive perishable goods</li>
                <li>• Risk of loss transfers to you upon delivery</li>
                <li>• Delivery fees apply as stated on our website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Returns and Refunds</h2>
              <p className="text-slate-600 mb-4">
                Due to the perishable nature of our products, we cannot accept returns. However, if you receive damaged
                or incorrect items, please contact us within 24 hours of delivery for a replacement or refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-600 mb-4">
                Our liability is limited to the purchase price of the products. We are not liable for any indirect,
                incidental, or consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-600">For questions about these Terms of Service, please contact us at:</p>
              <div className="mt-4 text-slate-600">
                <p>Email: legal@hokaaimeat.co.za</p>
                <p>Phone: +27 11 123 4567</p>
                <p>Address: 123 Main Street, Johannesburg, 2001</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
