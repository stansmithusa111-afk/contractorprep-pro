'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const HIDDEN_PATHS = ['/', '/exam'];

export default function NavHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  async function signOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav className="bg-navy text-white px-6 py-3 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-black text-lg tracking-tight hover:text-blue-200 transition">
          ContractorPrep Pro
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1 text-sm font-semibold">
          <Link href="/" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Home
          </Link>
          <Link href="/general" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            General
          </Link>
          <Link href="/building" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Building
          </Link>
          <Link href="/residential" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Residential
          </Link>
          <Link href="/bf" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            B&amp;F
          </Link>
          <Link href="/exam/sample" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Free Sample
          </Link>
          {user && (
            <Link href="/exam" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
              Full Exam
            </Link>
          )}
          <span className="w-px h-5 bg-blue-700 mx-2" />
          {user ? (
            <>
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
                Sign In
              </Link>
              <Link href="/auth/signup" className="ml-1 bg-white text-navy px-4 py-1.5 rounded-lg hover:bg-blue-50 transition">
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 pb-2 border-t border-blue-700 pt-3 flex flex-col gap-1 text-sm font-semibold">
          <Link href="/" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Home
          </Link>
          <Link href="/general" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            General
          </Link>
          <Link href="/building" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Building
          </Link>
          <Link href="/residential" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Residential
          </Link>
          <Link href="/bf" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            B&amp;F
          </Link>
          <Link href="/exam/sample" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
            Free Sample
          </Link>
          {user && (
            <Link href="/exam" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
              Full Exam
            </Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-left px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition">
                Sign In
              </Link>
              <Link href="/auth/signup" className="mx-3 mt-1 bg-white text-navy px-4 py-2 rounded-lg hover:bg-blue-50 transition text-center">
                Get Access
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
