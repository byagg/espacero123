"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Heart, Calendar, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { AuthModal } from "@/components/AuthModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-amber-600">ESPACERO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/venues" className="text-gray-700 hover:text-amber-600 transition-colors">
                Priestory
              </Link>
              <Link href="/host" className="text-gray-700 hover:text-amber-600 transition-colors">
                Prenajímať
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
                O nás
              </Link>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Rezervácie
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Obľúbené
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Odhlásiť sa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
                  Prihlásiť sa
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-amber-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/venues"
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Priestory
                </Link>
                <Link
                  href="/host"
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prenajímať
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  O nás
                </Link>

                {user ? (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <Link
                      href="/profile"
                      className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profil
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Rezervácie
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Obľúbené
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Odhlásiť sa
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Prihlásiť sa
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
