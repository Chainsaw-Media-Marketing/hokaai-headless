import Link from "next/link"

const Truck = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
    />
  </svg>
)

export function PromoBand() {
  return (
    <div className="bg-brand-red text-white py-2 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-center lg:hidden">
          <Truck />
          <span className="font-semibold text-sm">Free delivery in Pta & Centurion</span>
          <Link href="/delivery-info" className="underline hover:no-underline whitespace-nowrap text-sm">
            Details
          </Link>
        </div>

        {/* Desktop: Original full text */}
        <div className="hidden lg:flex items-center justify-center space-x-3 text-center">
          <Truck />
          <span className="font-semibold text-base">
            Local delivery from Faerie Glen. Free delivery within 5 km, or on orders over R1 000 in Pretoria &
            Centurion.
          </span>
          <Link
            href="/delivery-info"
            className="underline hover:no-underline whitespace-nowrap inline-flex items-center px-3 py-2 rounded"
          >
            See details
          </Link>
        </div>
      </div>
    </div>
  )
}
