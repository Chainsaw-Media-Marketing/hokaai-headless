import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Payment cancelled – Hokaai Meat Market",
  description: "Your payment was cancelled or could not be completed.",
}

export default function OrderCancelledPage({
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
            {/* Warning Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-brand-primary mb-4">Payment cancelled</h1>

              <p className="text-lg text-slate-700 mb-6">
                It looks like your payment was cancelled or didn't go through.
              </p>

              <p className="text-slate-700 mb-8">
                No money should have been taken. You can review your cart and try again if you'd like.
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
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-slate-700">
                  If you're unsure whether your order went through, please contact us at{" "}
                  <a href="mailto:info@hokaaimeatmarket.co.za" className="text-brand-red hover:underline">
                    info@hokaaimeatmarket.co.za
                  </a>
                  .
                </p>
              </div>

              {/* Primary CTA */}
              <Link href="/cart">
                <Button size="lg" className="w-full lg:w-auto mb-4 bg-brand-red hover:bg-brand-red/90">
                  Back to cart
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
