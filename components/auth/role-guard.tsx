"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/" }: RoleGuardProps) {
  const { user, loading, getUserRole } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/")
        return
      }

      const userRole = getUserRole()
      if (userRole && allowedRoles.includes(userRole)) {
        setIsAuthorized(true)
      } else {
        router.push(fallbackPath)
      }
    }
  }, [user, loading, getUserRole, allowedRoles, fallbackPath, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Načítavam...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Presmerovávam...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
