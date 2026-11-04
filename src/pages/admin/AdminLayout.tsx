import { type ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import AdminHeader from "./components/AdminHeader";
import AuthGuard from "../../components/AuthGuard";

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-stone/40 font-sans text-charcoal">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader title={title} />
          <main id="main-content" tabIndex={-1} className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
