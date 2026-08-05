'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    // Requires an active recovery session, established automatically from the
    // reset-link URL when this page loads (see forgot-password's redirectTo).
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8">
        <h1 className="text-xl font-black text-navy mb-2">Set a new password</h1>
        {done ? (
          <p className="text-sm text-green-700 mt-4">
            Password updated. Redirecting you to your dashboard...
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Choose a new password for your account.
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error} If your reset link expired, request a new one{' '}
                <Link href="/auth/forgot-password" className="underline font-semibold">here</Link>.
              </p>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="password"
                  aria-label="New password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-navy outline-none"
                />
                <p className="text-xs text-gray-400 mt-1.5 px-1">
                  At least {MIN_PASSWORD_LENGTH} characters.
                </p>
              </div>
              <input
                type="password"
                aria-label="Confirm new password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-navy outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 transition"
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
