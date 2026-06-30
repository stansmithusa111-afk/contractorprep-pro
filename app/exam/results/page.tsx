'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

const AREA_NAMES: Record<string, string> = {
  A: 'Establishing Business',
  B: 'Administrative Duties',
  C: 'Trade Operations',
  D: 'Accounting Functions',
  E: 'Human Resources',
  F: 'Government Regulations',
};
const DBPR_TARGETS: Record<string, number> = { A:13, B:31, C:12, D:38, E:8, F:18 };

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading results...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}

type MissedQuestion = {
  question_text: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string;
  source_ref: string | null;
  selected_answer: string | null;
};

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const attemptId = params.get('attempt');
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missedByArea, setMissedByArea] = useState<Record<string, MissedQuestion[]>>({});
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    async function load() {
      const supabase = createClient();
      const [{ data: attemptData }, { data: missedData }] = await Promise.all([
        supabase.from('exam_attempts').select('*').eq('id', attemptId).single(),
        supabase.from('attempt_answers')
          .select('selected_answer, questions(question_text, option_a, option_b, option_c, option_d, correct_answer, source_ref, dbpr_area)')
          .eq('attempt_id', attemptId)
          .eq('is_correct', false),
      ]);
      setAttempt(attemptData);
      const byArea: Record<string, MissedQuestion[]> = { A:[], B:[], C:[], D:[], E:[], F:[] };
      missedData?.forEach((row: any) => {
        const q = row.questions;
        if (q?.dbpr_area && byArea[q.dbpr_area]) {
          byArea[q.dbpr_area].push({ ...q, selected_answer: row.selected_answer });
        }
      });
      setMissedByArea(byArea);
      setLoading(false);
    }
    load();
  }, [attemptId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading results...</p></div>;
  if (!attempt) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">Results not found.</p></div>;

  const passed = attempt.score >= 70;
  const areaScores = attempt.area_scores as Record<string, number>;

  function getPassProbability(score: number): { label: string; detail: string; pct: number; color: string; bg: string; border: string } {
    if (score >= 90) return { label: 'Very High',                   detail: 'Excellent preparation — you\'re well above the passing threshold.',  pct: 95, color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' };
    if (score >= 80) return { label: 'High',                        detail: 'Strong performance — you have a solid buffer above the cutoff.',      pct: 80, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' };
    if (score >= 70) return { label: 'Moderate — at the threshold', detail: 'You\'re passing, but close to the cutoff. A bit more review helps.',  pct: 55, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (score >= 60) return { label: 'Low — more study needed',     detail: 'You\'re close but not yet passing. Focus on your weakest areas.',     pct: 30, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return              { label: 'Very Low',                         detail: 'Significant study time needed before you\'re ready to sit the exam.', pct: 10, color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200' };
  }

  const prob = getPassProbability(attempt.score);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Score card */}
        <div className={`rounded-2xl shadow p-8 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          <div className="text-5xl mb-3">{passed ? '🎉' : '📚'}</div>
          <div className={`text-6xl font-black mb-2 ${passed ? 'text-green-700' : 'text-red-600'}`}>
            {attempt.score}%
          </div>
          <p className={`text-xl font-bold mb-1 ${passed ? 'text-green-700' : 'text-red-600'}`}>
            {passed ? 'Passing Score' : 'Not Passing — Keep Studying'}
          </p>
          <p className="text-gray-500 text-sm">
            {attempt.total_questions} scored questions · {formatTime(attempt.time_seconds)} ·{' '}
            {new Date(attempt.completed_at).toLocaleDateString()}
          </p>
        </div>

        {/* Pretest notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex gap-3 items-start">
          <span className="text-blue-500 mt-0.5 flex-shrink-0">ℹ️</span>
          <p className="text-sm text-blue-800">
            This exam included 5 unscored pretest items distributed randomly throughout the exam.
            Your score reflects your performance on the 120 scored questions only.
          </p>
        </div>

        {/* Pass probability */}
        <div className={`rounded-2xl border-2 p-6 ${prob.bg} ${prob.border}`}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Pass Probability Estimate</p>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xl font-black ${prob.color}`}>{prob.label}</span>
            <span className={`text-2xl font-black ${prob.color}`}>{prob.pct}%</span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                prob.pct >= 80 ? 'bg-green-500' : prob.pct >= 55 ? 'bg-amber-400' : prob.pct >= 30 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${prob.pct}%` }}
            />
          </div>
          <p className={`text-sm ${prob.color}`}>{prob.detail}</p>
        </div>

        {/* Area breakdown */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-navy text-lg mb-1">Score by Content Area</h2>
          <p className="text-xs text-gray-400 mb-4">Click any area to see missed questions.</p>
          <div className="space-y-2">
            {Object.keys(AREA_NAMES).sort().map(area => {
              const correct = areaScores[area] || 0;
              const target = DBPR_TARGETS[area];
              const pct = Math.round((correct / target) * 100);
              const barColor = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';
              const isOpen = expandedArea === area;
              const missed = missedByArea[area] || [];
              const OPTION_LABELS: Record<string, string> = { A: 'option_a', B: 'option_b', C: 'option_c', D: 'option_d' };
              return (
                <div key={area} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedArea(isOpen ? null : area)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">
                        <span className="inline-block bg-navy text-white text-xs px-1.5 py-0.5 rounded mr-2 font-bold">{area}</span>
                        {AREA_NAMES[area]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                          {correct}/{target} ({pct}%)
                        </span>
                        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-5">
                      {missed.length === 0 ? (
                        <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                          <span>✓</span> No missed questions in this area.
                        </p>
                      ) : (
                        missed.map((q, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                            <p className="text-sm font-medium text-gray-900 leading-snug">{q.question_text}</p>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold">
                              {q.selected_answer && (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                  Your answer: {q.selected_answer} — {q[OPTION_LABELS[q.selected_answer] as keyof MissedQuestion] as string}
                                </span>
                              )}
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                Correct: {q.correct_answer} — {q[OPTION_LABELS[q.correct_answer] as keyof MissedQuestion] as string}
                              </span>
                            </div>
                            {q.source_ref && (
                              <p className="text-xs text-gray-400 italic">{q.source_ref}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">Passing threshold: 70% per area is recommended. Overall 70% required to pass.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/exam')}
            className="flex-1 bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition"
          >
            Take Another Exam
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
