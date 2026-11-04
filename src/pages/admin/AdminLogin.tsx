import { useState, type FormEvent } from "react"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../../lib/auth"
import { useRouter } from "../../lib/router"

export default function AdminLogin() {
  const { login } = useAuth()
  const { navigate } = useRouter()
  const [email, setEmail] = useState("admin@avancelawpartners.info")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    const res = await login(email, password)
    setSubmitting(false)

    if (res.error) {
      setError(
        res.error.message ||
          "Failed to sign in. Please verify your credentials.",
      )
    } else {
      navigate("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian text-ivory p-6">
      <div className="w-full max-w-md bg-charcoal/60 rounded-xl border border-line-dark p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/20 border border-gold/40 text-gold font-serif text-2xl font-bold mb-3">
            A
          </div>
          <h1 className="font-serif text-3xl text-ivory tracking-tight">
            Avance Law Partners
          </h1>
          <p className="text-xs tracking-widest uppercase text-gold mt-1">
            Admin Portal
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded bg-red-900/30 border border-red-800/60 p-3.5 text-xs text-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              autoComplete="username"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@avancelawpartners.info"
              className="w-full rounded border border-line-dark bg-obsidian px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-ivory/70"
              >
                Password
              </label>
            </div>
            <input
              id="admin-password"
              autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-line-dark bg-obsidian px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded bg-gold py-3 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] transition-colors focus:outline-none disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <div className="mt-8 border-t border-line-dark pt-4 text-center">
          <a
            href="#/"
            className="text-xs text-ivory/50 hover:text-gold transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft aria-hidden size={13} /> Return to public website
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
