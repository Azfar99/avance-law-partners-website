// Avance Law Partners. Auth Context & Helpers
import { useEffect, useState } from "react"
import { supabase, verifyCurrentAdmin } from "./supabase"

export interface AdminUser {
  id: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let disposed = false, sequence = 0
    const verify = async () => {
      const current = ++sequence
      setLoading(true)
      const admin = await verifyCurrentAdmin()
      if (!disposed && current === sequence) { setUser(admin); setLoading(false) }
    }
    void verify()
    const { data } = supabase.auth.onAuthStateChange(() => { void verify() })
    return () => {
      disposed = true
      data?.subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password?: string) => {
    setLoading(true)
    const res = await supabase.auth.signInWithPassword({ email, password })
    if (!res.error && !await verifyCurrentAdmin()) {
      await supabase.auth.signOut()
      setLoading(false)
      return { data: null, error: { message: "This account does not have administrator access." } }
    }
    setLoading(false)
    return res
  }

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
  }

  return { user, loading, login, logout, isAuthenticated: Boolean(user) }
}
