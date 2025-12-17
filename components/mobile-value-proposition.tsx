import { Truck, MapPin, ShoppingBag } from "lucide-react"

export function MobileValueProposition() {
  return (
    <div className="lg:hidden bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white py-4 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <ShoppingBag className="h-6 w-6" />
            <p className="text-xs font-semibold">Premium Quality</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-6 w-6" />
            <p className="text-xs font-semibold">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin className="h-6 w-6" />
            <p className="text-xs font-semibold">Gauteng Wide</p>
          </div>
        </div>
      </div>
    </div>
  )
}
