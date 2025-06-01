import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-500">ESPACERO</span>
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              Platforma pre rezerváciu priestorov na Slovensku. Nájdite perfektný priestor pre vaše podujatie alebo
              ponúknite svoj priestor ostatným.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Rýchle odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Vyhľadávanie
                </Link>
              </li>
              <li>
                <Link href="/venues/add" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Pridať priestor
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-amber-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                info@espacero.sk
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                +421 123 456 789
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                Bratislava, Slovensko
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ESPACERO. Všetky práva vyhradené.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                Ochrana súkromia
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                Podmienky používania
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
