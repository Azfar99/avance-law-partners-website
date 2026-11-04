import { useRouter } from "../../../lib/router";
import {
  ExternalLink,
  FileText,
  Image,
  Inbox,
  LayoutDashboard,
  Pencil,
  Scale,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

const MENU_ITEMS: { label: string; path: string; icon: LucideIcon }[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Lawyers", path: "/admin/lawyers", icon: Users },
  { label: "Services", path: "/admin/services", icon: Scale },
  { label: "Enquiries", path: "/admin/enquiries", icon: Inbox },
  { label: "Site Settings", path: "/admin/settings", icon: Settings },
  { label: "Page Editor", path: "/admin/pages", icon: Pencil },
  { label: "Media Library", path: "/admin/media", icon: Image },
  { label: "Legal Pages", path: "/admin/legal", icon: FileText },
  { label: "SEO Settings", path: "/admin/seo", icon: Search },
];

export default function Sidebar() {
  const { path, navigate } = useRouter();

  return (
    <aside className="w-64 flex-shrink-0 bg-obsidian text-ivory flex flex-col min-h-screen border-r border-line-dark">
      {/* Brand */}
      <div className="p-6 border-b border-line-dark flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-gold/20 border border-gold/40 flex items-center justify-center font-serif text-gold font-bold">
          A
        </div>
        <div>
          <h2 className="font-serif text-base tracking-wide text-ivory">Avance Law</h2>
          <p className="text-[10px] tracking-widest uppercase text-gold">Admin Console</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Administration" className="flex-1 px-3 py-6 space-y-1">
        {MENU_ITEMS.map((item) => {
          const active = path === item.path || (item.path !== "/admin" && path.startsWith(item.path));
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-medium transition-colors ${
                active
                  ? "bg-gold text-obsidian font-semibold"
                  : "text-ivory/70 hover:text-ivory hover:bg-charcoal"
              }`}
            >
              <Icon aria-hidden size={17} strokeWidth={1.7} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="p-4 border-t border-line-dark space-y-2">
        <a
          href="#/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gold hover:underline"
        >
          <ExternalLink aria-hidden size={14} strokeWidth={1.8} /> View Public Website
        </a>
      </div>
    </aside>
  );
}
