'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

type Phase = 'loading' | 'form' | 'success' | 'unauthenticated';

export default function RedeemPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [licenseTrack, setLicenseTrack] = useState('');

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setPhase(session ? 'form' : 'unauthenticated');
    });
  }, []);

  async function handleRedeem() {
    if (!code.trim()) { setError('Please enter an access code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
      setLicenseTrack(data.license_track);
      setPhase('success');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (phase === 'unauthenticated') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-xl font-black text-navy mb-2">Sign in to Redeem</h1>
        <p className="text-gray-500 text-sm mb-6">
          You need an account to redeem an access code. Create one first — it only takes a moment.
        </p>
        <Link href="/auth/signup" className="block w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition text-center mb-3">
          Create Account
        </Link>
        <Link href="/auth/login" className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-300 transition text-center">
          Sign In
        </Link>
      </div>
    </div>
  );

  if (phase === 'success') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-navy mb-2">Access Granted!</h1>
        <p className="text-gray-600 mb-2">
          You now have <span className="font-bold text-navy">180 days</span> of full access
          on the <span className="font-bold text-navy">{licenseTrack}</span> track.
        </p>
        <p className="text-gray-400 text-sm mb-6">Unlimited exam attempts included.</p>
        <Link
          href="/dashboard"
          className="block w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition text-center"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8">
        <div className="text-4xl mb-4">🎟️</div>
        <h1 className="text-xl font-black text-navy mb-1">Redeem Access Code</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your code below to unlock 180 days of full access.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleRedeem()}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-center text-lg tracking-widest focus:border-navy outline-none uppercase"
            maxLength={32}
            autoFocus
          />
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 transition"
          >
            {loading ? 'Checking code...' : 'Redeem Code'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have a code?{' '}
          <Link href="/auth/signup" className="text-navy font-semibold">Get full access for $49</Link>
        </p>
      </div>
    </div>
  );
}
