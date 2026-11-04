import { type ReactNode } from "react"
import { useAuth } from "../lib/auth"
import AdminLogin from "../pages/admin/AdminLogin"

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ivory">
        <div className="text-center font-sans text-sm tracking-widest text-charcoal/60 uppercase">
          Verifying security session...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <>{children}</>
}
