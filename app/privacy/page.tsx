export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: January 2024</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase,
                or contact us for support.
              </p>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• Personal information (name, email, phone number, address)</li>
                <li>• Payment information (processed securely through our payment providers)</li>
                <li>• Order history and preferences</li>
                <li>• Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">We use the information we collect to:</p>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• Process and fulfill your orders</li>
                <li>• Communicate with you about your orders and account</li>
                <li>• Send you promotional materials (with your consent)</li>
                <li>• Improve our products and services</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
              <p className="text-slate-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as
                described in this policy:
              </p>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• Service providers who assist in our operations</li>
                <li>• Payment processors for transaction processing</li>
                <li>• Delivery partners for order fulfillment</li>
                <li>• Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="text-slate-600 space-y-2 ml-6">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and personal information</li>
                <li>• Opt out of marketing communications</li>
                <li>• Request data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 text-slate-600">
                <p>Email: privacy@hokaaimeat.co.za</p>
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
