"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/projects", label: "My Projects", icon: "📁" },
  { href: "/generate", label: "New Reel", icon: "✨" },
  { href: "/billing", label: "Billing", icon: "💳" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-60 shrink-0 bg-[#0a0c1a] border-r border-[#1e2340] min-h-screen p-4 flex flex-col">
      <Link href="/" className="text-xl font-bold font-jakarta text-white mb-8 px-2 block">
        ClipMind<span className="text-violet-400">AI</span>
      </Link>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              pathname === item.href
                ? "bg-violet-600/20 text-violet-300 font-medium"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        {(session?.user as any)?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mt-4 ${
              pathname.startsWith("/admin")
                ? "bg-violet-600/20 text-violet-300 font-medium"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🛡️</span>
            Admin Panel
          </Link>
        )}
      </nav>
      <div className="pt-4 border-t border-[#1e2340] px-2">
        <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
      </div>
    </aside>
  );
}
