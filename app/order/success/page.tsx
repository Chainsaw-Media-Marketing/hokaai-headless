import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Order confirmation – Hokaai Meat Market",
  description: "Thank you for your order at Hokaai Meat Market.",
}

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { reference?: string; orderId?: string; order_id?: string }
}) {
  const reference = searchParams.reference
  const orderId = searchParams.orderId || searchParams.order_id

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-brand-success rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-brand-primary mb-4">
                Thank you for your order
              </h1>

              <p className="text-lg text-slate-700 mb-6">
                Your payment was successful and your order has been captured in our system.
              </p>

              <p className="text-slate-700 mb-8">
                You'll receive an email confirmation with your order details shortly.
              </p>

              {/* Order Details */}
              {(reference || orderId) && (
                <div className="bg-slate-50 rounded-lg p-6 mb-8 space-y-3">
                  {reference && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-semibold">Payment reference:</span>
                      <span className="text-brand-primary font-mono">{reference}</span>
                    </div>
                  )}
                  {orderId && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-semibold">Order number:</span>
                      <span className="text-brand-primary font-mono">{orderId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-slate-700">
                  If you don't see your confirmation email within a few minutes, please check your spam folder or
                  contact us at{" "}
                  <a href="mailto:info@hokaaimeatmarket.co.za" className="text-brand-red hover:underline">
                    info@hokaaimeatmarket.co.za
                  </a>
                  .
                </p>
              </div>

              {/* Primary CTA */}
              <Link href="/collections/all">
                <Button size="lg" className="w-full lg:w-auto mb-4 bg-brand-red hover:bg-brand-red/90">
                  Back to shop
                </Button>
              </Link>

              {/* Secondary Link */}
              <div>
                <Link href="/" className="text-slate-600 hover:text-brand-red text-sm underline transition-colors">
                  Return to home page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
