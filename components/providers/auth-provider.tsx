"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: unknown | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<unknown | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Check session on mount
  React.useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()

      if (data.user) {
        setUser(data.user)
      }
    } catch {
      console.error("Failed to check session")
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to login")
      }

      setUser(data.user)
      router.push("/admin")
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
  } catch {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to login",
    })
  }
  }

  async function logout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (!res.ok) {
        throw new Error("Failed to logout")
      }
      setUser(null)
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have successfully logged out.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      })
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
