import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const AREA_NAMES: Record<string, string> = {
  A: 'Establishing Business', B: 'Administrative', C: 'Trade Operations',
  D: 'Accounting', E: 'Human Resources', F: 'Government Regs',
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const user = session.user;

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(10);

  const hasAccess = profile?.access_expires_at && new Date(profile.access_expires_at) > new Date();
  const daysLeft = hasAccess
    ? Math.ceil((new Date(profile.access_expires_at).getTime() - Date.now()) / 86400000)
    : 0;

  const bestScore = attempts?.length ? Math.max(...attempts.map((a: any) => a.score)) : null;
  const avgScore = attempts?.length
    ? Math.round(attempts.reduce((s: number, a: any) => s + a.score, 0) / attempts.length)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-navy text-white rounded-2xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">ContractorPrep Pro</h1>
            <p className="text-blue-200 text-sm mt-1">
              {profile?.license_track} Track · {hasAccess ? `${daysLeft} days remaining` : 'Access expired'}
            </p>
          </div>
          {hasAccess ? (
            <Link href="/exam" className="bg-white text-navy px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm">
              Start Exam →
            </Link>
          ) : (
            <Link href="/redeem" className="bg-white text-navy px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm">
              Redeem Code →
            </Link>
          )}
        </div>

        {/* Stats */}
        {attempts && attempts.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Exams taken', attempts.length, ''],
              ['Best score', `${bestScore}%`, bestScore! >= 70 ? 'text-green-600' : 'text-amber-600'],
              ['Average score', `${avgScore}%`, avgScore! >= 70 ? 'text-green-600' : 'text-amber-600'],
            ].map(([label, val, cls]) => (
              <div key={label as string} className="bg-white rounded-2xl shadow p-5 text-center">
                <div className={`text-3xl font-black ${cls}`}>{val}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent attempts */}
        {attempts && attempts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-navy text-lg mb-4">Recent Exams</h2>
            <div className="space-y-3">
              {attempts.map((a: any) => {
                const passed = a.score >= 70;
                return (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <span className={`font-bold text-lg ${passed ? 'text-green-600' : 'text-red-500'}`}>{a.score}%</span>
                      <span className="text-gray-400 text-sm ml-3">{new Date(a.completed_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {passed ? 'Pass' : 'Not passing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            {hasAccess ? (
              <>
                <p className="text-gray-400 mb-4">No exams taken yet. Start your first practice exam!</p>
                <Link href="/exam" className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition">
                  Take First Exam
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-2">You don't have active access yet.</p>
                <p className="text-gray-400 text-sm mb-6">Redeem an access code or purchase full access to start practicing.</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/redeem" className="bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition">
                    Redeem Code
                  </Link>
                  <Link href="/auth/signup" className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:border-gray-300 transition">
                    Get Access — $49
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
