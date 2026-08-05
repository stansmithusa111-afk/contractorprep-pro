'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8">
        <h1 className="text-xl font-black text-navy mb-2">Reset your password</h1>
        {sent ? (
          <p className="text-sm text-gray-600 mt-4">
            If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                aria-label="Email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-navy outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 transition"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/auth/login" className="text-navy font-semibold">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
