import { lazy, Suspense } from "react"
import { PrivatePageSEO } from "./components/SEOHead"
import { RouterProvider, useRouter } from "./lib/router"
import { ChromeProvider } from "./lib/chrome"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Approach from "./pages/Approach"
import Lawyers from "./pages/Lawyers"
import LawyerProfile from "./pages/LawyerProfile"
import Services from "./pages/Services"
import ServiceDetail from "./pages/ServiceDetail"
import Contact from "./pages/Contact"
import Legal from "./pages/Legal"
import { NotFound } from "./pages/NotFound"
import { LanguageProvider } from "./lib/i18n"
import AppErrorBoundary from "./components/AppErrorBoundary"

// Admin views
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"))
const AdminLawyersList = lazy(() => import("./pages/admin/AdminLawyersList"))
const AdminLawyerEdit = lazy(() => import("./pages/admin/AdminLawyerEdit"))
const AdminServicesList = lazy(() => import("./pages/admin/AdminServicesList"))
const AdminServiceEdit = lazy(() => import("./pages/admin/AdminServiceEdit"))
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"))
const AdminEnquiryDetail = lazy(
  () => import("./pages/admin/AdminEnquiryDetail"),
)
const AdminPageEditor = lazy(() => import("./pages/admin/AdminPageEditor"))
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"))
const AdminLegalPages = lazy(() => import("./pages/admin/AdminLegalPages"))
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"))

function Routes() {
  const { path } = useRouter()
  const seg = path.split("/").filter(Boolean)

  // Admin Routes
  if (seg[0] === "admin") {
    if (import.meta.env.VITE_PUBLIC_PREVIEW === "true") return <NotFound />
    if (seg.length === 1) return <AdminDashboard />
    if (seg[1] === "login") return <AdminLogin />
    if (seg[1] === "settings") return <AdminSiteSettings />
    if (seg[1] === "lawyers") {
      if (seg[2]) return <AdminLawyerEdit slug={seg[2]} />
      return <AdminLawyersList />
    }
    if (seg[1] === "services") {
      if (seg[2]) return <AdminServiceEdit slug={seg[2]} />
      return <AdminServicesList />
    }
    if (seg[1] === "enquiries") {
      if (seg[2]) return <AdminEnquiryDetail id={seg[2]} />
      return <AdminEnquiries />
    }
    if (seg[1] === "pages") return <AdminPageEditor />
    if (seg[1] === "media") return <AdminMedia />
    if (seg[1] === "legal") return <AdminLegalPages />
    if (seg[1] === "seo") return <AdminSEO />
    return <AdminDashboard />
  }

  // Public Routes
  let page
  if (path === "/") page = <Home />
  else if (path === "/about") page = <About />
  else if (path === "/approach") page = <Approach />
  else if (path === "/lawyers") page = <Lawyers />
  else if (seg[0] === "lawyers" && seg[1] && seg.length === 2)
    page = <LawyerProfile slug={seg[1]} />
  else if (path === "/services") page = <Services />
  else if (seg[0] === "services" && seg[1] && seg.length === 2)
    page = <ServiceDetail slug={seg[1]} />
  else if (path === "/contact") page = <Contact />
  else if (path === "/privacy") page = <Legal kind="privacy" />
  else if (path === "/disclaimer") page = <Legal kind="disclaimer" />
  else if (path === "/terms") page = <Legal kind="terms" />
  else page = <NotFound />

  return page
}

function AppShell() {
  const { path } = useRouter()
  const isAdmin = path === "/admin" || path.startsWith("/admin/")

  if (isAdmin) {
    return <><PrivatePageSEO /><Routes key={path} /></>
  }

  return (
    <LanguageProvider>
      <ChromeProvider>
        <a
          href="#main-content"
          onClick={(event) => {
            event.preventDefault()
            const main = document.getElementById("main-content")
            main?.focus({ preventScroll: true })
            main?.scrollIntoView({ behavior: "instant", block: "start" })
          }}
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[5px] focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-obsidian"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <Suspense
            fallback={
              <div
                role="status"
                className="min-h-[50vh] bg-ivory px-5 pt-32 text-ink-60"
              >
                Loading page...
              </div>
            }
          >
            <Routes key={path} />
          </Suspense>
        </main>
        <Footer />
      </ChromeProvider>
    </LanguageProvider>
  )
}

export default function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider>
        <Suspense
          fallback={
            <div
              role="status"
              className="min-h-screen bg-ivory p-8 text-charcoal"
            >
              Loading page...
            </div>
          }
        >
          <AppShell />
        </Suspense>
      </RouterProvider>
    </AppErrorBoundary>
  )
}
