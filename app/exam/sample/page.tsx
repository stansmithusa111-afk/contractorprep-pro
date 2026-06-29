'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  dbpr_area: string;
  source_ref: string | null;
};

const AREA_NAMES: Record<string, string> = {
  A: 'Establishing Business', B: 'Administrative', C: 'Trade Operations',
  D: 'Accounting', E: 'Human Resources', F: 'Government Regulations',
};

type Phase = 'loading' | 'start' | 'question' | 'feedback' | 'done';

export default function SampleExamPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/sample-questions')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setQuestions(data);
        setPhase('start');
      })
      .catch(() => setError('Failed to load questions. Please try again.'));
  }, []);

  function pickAnswer(letter: string) {
    if (phase !== 'question') return;
    setSelected(letter);
    if (letter === questions[current].correct_answer) setScore(s => s + 1);
    setPhase('feedback');
  }

  function next() {
    if (current + 1 >= questions.length) {
      setPhase('done');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setPhase('question');
    }
  }

  const q = questions[current];

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-navy text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
      </div>
    </div>
  );

  if (phase === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading sample exam...</p>
    </div>
  );

  if (phase === 'start') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-2xl font-black text-navy mb-2">Free Sample Exam</h1>
        <p className="text-gray-500 mb-6">
          10 questions from the Florida Contractor B&F exam bank.<br />
          No login required. Instant feedback after each answer.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          {[['10', 'Questions'], ['No Timer', 'Self-Paced'], ['Instant', 'Feedback']].map(([val, label]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-3">
              <div className="text-lg font-bold text-blue-700">{val}</div>
              <div className="text-blue-600 text-xs">{label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhase('question')}
          className="w-full bg-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition"
        >
          Start Sample Exam →
        </button>
        <p className="text-sm text-gray-400 mt-4">
          Already have an account? <Link href="/auth/login" className="text-navy font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );

  if (phase === 'done') {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full space-y-4">
          <div className={`rounded-2xl shadow p-8 text-center border-2 ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="text-5xl mb-3">{passed ? '🎉' : '📚'}</div>
            <div className={`text-6xl font-black mb-2 ${passed ? 'text-green-700' : 'text-red-600'}`}>{pct}%</div>
            <p className={`text-xl font-bold mb-1 ${passed ? 'text-green-700' : 'text-red-600'}`}>
              {score} / {questions.length} correct
            </p>
            <p className="text-gray-500 text-sm">{passed ? 'Great work on the sample!' : 'Keep studying — you\'ve got this!'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-lg font-black text-navy mb-1">Ready for the full exam?</h2>
            <p className="text-gray-500 text-sm mb-4">
              Get access to 120-question blueprint-weighted practice exams with detailed scoring by DBPR content area.
            </p>
            <Link
              href="/auth/signup"
              className="block w-full bg-navy text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-900 transition text-center"
            >
              Get Full Access — $49
            </Link>
            <p className="text-xs text-gray-400 mt-3">One-time payment · Unlimited attempts · 180 days access</p>
          </div>

          <button
            onClick={() => { setCurrent(0); setScore(0); setSelected(null); setPhase('loading'); window.location.reload(); }}
            className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:border-gray-300 transition"
          >
            Try Another Sample
          </button>
        </div>
      </div>
    );
  }

  // question + feedback phases
  const isCorrect = selected === q.correct_answer;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-navy text-white px-6 py-3 flex items-center justify-between">
        <div className="font-bold text-sm">ContractorPrep Pro · Free Sample</div>
        <div className="text-sm text-blue-200">Question {current + 1} of {questions.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-blue-900">
        <div
          className="h-full bg-white/60 transition-all"
          style={{ width: `${((current + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-start justify-center p-6">
        <div className="max-w-2xl w-full space-y-4">
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400 font-medium">Question {current + 1} of {questions.length}</span>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Area {q.dbpr_area} · {AREA_NAMES[q.dbpr_area]}
              </span>
            </div>

            <p className="text-lg font-medium text-gray-900 leading-relaxed mb-6">{q.question_text}</p>

            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map(letter => {
                const text = q[`option_${letter.toLowerCase()}` as keyof Question] as string;
                const isSelected = selected === letter;
                const isAnswer = letter === q.correct_answer;

                let cls = 'border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50';
                if (phase === 'feedback') {
                  if (isAnswer) cls = 'border-green-500 bg-green-50 text-green-900';
                  else if (isSelected) cls = 'border-red-400 bg-red-50 text-red-800';
                  else cls = 'border-gray-200 text-gray-400';
                } else if (isSelected) {
                  cls = 'border-blue-600 bg-blue-50 text-blue-900';
                }

                return (
                  <button
                    key={letter}
                    onClick={() => pickAnswer(letter)}
                    disabled={phase === 'feedback'}
                    className={`w-full text-left p-4 rounded-xl border-2 transition font-medium disabled:cursor-default ${cls}`}
                  >
                    <span className={`inline-block w-7 h-7 rounded-full text-sm font-bold text-center leading-7 mr-3 ${
                      phase === 'feedback' && isAnswer ? 'bg-green-500 text-white'
                      : phase === 'feedback' && isSelected ? 'bg-red-400 text-white'
                      : isSelected ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{letter}</span>
                    {text}
                    {phase === 'feedback' && isAnswer && <span className="ml-2 text-green-600 font-bold">✓ Correct</span>}
                    {phase === 'feedback' && isSelected && !isAnswer && <span className="ml-2 text-red-500 font-bold">✗</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback panel */}
          {phase === 'feedback' && (
            <div className={`rounded-2xl border-2 p-5 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '✓ Correct!' : `✗ Incorrect — correct answer: ${q.correct_answer}`}
              </p>
              {q.source_ref && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Source:</span> {q.source_ref}
                </p>
              )}
              <button
                onClick={next}
                className="mt-4 w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition"
              >
                {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
