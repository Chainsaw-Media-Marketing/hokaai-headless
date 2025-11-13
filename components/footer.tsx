import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SocialIcons } from "./social-icons"

const MapPinIcon = () => (
  <svg className="h-5 w-5 mt-0.5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-5 w-5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const MailIcon = () => (
  <svg className="h-5 w-5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-5 w-5 mt-0.5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon />
                <div>
                  <p>Hokaai Shopping Centre</p>
                  <p>558 Graaff Reinet St, Faerie Glen</p>
                  <p>Pretoria, 0081</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon />
                <p>012 991 2801</p>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon />
                <p>faerieglen@hokaaimeatmarket.co.za</p>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon />
                <div>
                  <p className="font-semibold mb-1">Store Hours:</p>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 8:00 AM - 4:00 PM</p>
                  <p>Sun: 9:00 AM - 1:00 PM</p>
                  <p className="font-semibold mt-2 mb-1">Delivery Hours:</p>
                  <p>Mon: 9:30 AM - 4:00 PM</p>
                  <p>Tue-Fri: 9:00 AM - 4:00 PM</p>
                  <p>Sat: 9:00 AM - 3:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/collections/beef" className="hover:text-brand-red transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-red transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-red transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand-red transition-colors">
                  News/Recipes
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-brand-red transition-colors">
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-red transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-brand-red transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Online Store */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Online Store</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-200">Secure Payments</p>
              <div className="flex space-x-4">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-sm">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-red-600 font-bold text-sm">MC</span>
                </div>
              </div>
              <p className="text-sm text-gray-200 mt-4">Free delivery on orders over R800</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-200 mb-4">
              Get the latest news, recipes, and special offers delivered to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent text-white placeholder-gray-400"
              />
              <Button variant="primary" size="sm" className="w-full">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-2">By subscribing, you agree to our privacy policy.</p>

            <div className="mt-6 flex justify-center">
              <SocialIcons className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {currentYear} Hokaai Meat Market. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
