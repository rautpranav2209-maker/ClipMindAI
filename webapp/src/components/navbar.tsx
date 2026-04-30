"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#080a12]/80 backdrop-blur-md border-b border-[#1e2340] px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold font-jakarta text-white">
        ClipMind<span className="text-violet-400">AI</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
        <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
        {session ? (
          <>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <button onClick={() => signOut()} className="btn-ghost">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="btn-primary text-sm px-4 py-2 rounded-xl">Get started</Link>
          </>
        )}
      </div>
      <button className="md:hidden text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0f1120] border-b border-[#1e2340] p-4 flex flex-col gap-3 text-sm md:hidden">
          <Link href="/#features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
