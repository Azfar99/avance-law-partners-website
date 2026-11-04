import { useAuth } from "../../../lib/auth";

export default function AdminHeader({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-ivory border-b border-line-light px-8 flex items-center justify-between">
      <h1 className="font-serif text-2xl text-obsidian">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-ink-60 bg-stone px-3 py-1 rounded-full border border-line-light">
          {user?.email || "admin@avancelawpartners.info"}
        </span>
        <button
          type="button"
          onClick={logout}
          className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 hover:text-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
