'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchExamQuestions, saveExamAttempt, Question } from '@/lib/exam';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ── Calculator ────────────────────────────────────────────────
function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState('0');
  const [pending, setPending] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  function inputDigit(d: string) {
    setDisplay(prev => (fresh || prev === '0') ? d : prev.length < 12 ? prev + d : prev);
    setFresh(false);
  }

  function inputDot() {
    setDisplay(prev => {
      const val = fresh ? '0.' : prev.includes('.') ? prev : prev + '.';
      setFresh(false);
      return val;
    });
  }

  function inputOp(nextOp: string) {
    const val = parseFloat(display);
    if (pending !== null && op && !fresh) {
      const result = calc(pending, val, op);
      setDisplay(String(result));
      setPending(result);
    } else {
      setPending(val);
    }
    setOp(nextOp);
    setFresh(true);
  }

  function calc(a: number, b: number, o: string) {
    if (o === '+') return round(a + b);
    if (o === '-') return round(a - b);
    if (o === '×') return round(a * b);
    if (o === '÷') return b !== 0 ? round(a / b) : 0;
    if (o === '%') return round(a * (b / 100));
    return b;
  }

  function round(n: number) {
    return Math.round(n * 1e10) / 1e10;
  }

  function equals() {
    if (pending === null || !op) return;
    const result = calc(pending, parseFloat(display), op);
    setDisplay(String(result));
    setPending(null);
    setOp(null);
    setFresh(true);
  }

  function clear() { setDisplay('0'); setPending(null); setOp(null); setFresh(true); }

  function backspace() {
    if (fresh) return;
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }

  const btn = (label: string, action: () => void, cls = '') => (
    <button key={label} onClick={action}
      className={`h-10 rounded-lg text-sm font-bold transition active:scale-95 ${cls}`}>
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-24 right-6 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      <div className="bg-navy text-white px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-bold">🧮 Calculator</span>
        <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 text-lg leading-none">×</button>
      </div>
      <div className="p-3 space-y-2">
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-right font-mono text-xl font-bold text-gray-800 min-h-[2.5rem] overflow-hidden">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {btn('C', clear, 'col-span-2 bg-red-100 text-red-700 hover:bg-red-200')}
          {btn('⌫', backspace, 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
          {btn('÷', () => inputOp('÷'), 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
          {btn('7', () => inputDigit('7'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('8', () => inputDigit('8'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('9', () => inputDigit('9'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('×', () => inputOp('×'), 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
          {btn('4', () => inputDigit('4'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('5', () => inputDigit('5'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('6', () => inputDigit('6'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('-', () => inputOp('-'), 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
          {btn('1', () => inputDigit('1'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('2', () => inputDigit('2'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('3', () => inputDigit('3'), 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('+', () => inputOp('+'), 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
          {btn('0', () => inputDigit('0'), 'col-span-2 bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('.', inputDot, 'bg-gray-50 text-gray-800 hover:bg-gray-100')}
          {btn('%', () => inputOp('%'), 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
          {btn('=', equals, 'col-span-4 bg-navy text-white hover:bg-blue-900')}
        </div>
      </div>
    </div>
  );
}

// ── Notepad ───────────────────────────────────────────────────
function Notepad({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  return (
    <div className="fixed bottom-24 right-6 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      <div className="bg-navy text-white px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-bold">📝 Notepad</span>
        <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 text-lg leading-none">×</button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type scratch notes here..."
        className="w-full h-52 p-3 text-sm text-gray-800 resize-none outline-none font-mono"
      />
      <div className="px-3 pb-2 flex justify-between items-center">
        <span className="text-xs text-gray-400">Clears on submit</span>
        <button onClick={() => setText('')} className="text-xs text-red-500 hover:text-red-700 font-semibold">Clear</button>
      </div>
    </div>
  );
}

const EXAM_MINUTES = 390; // 6.5 hours in minutes
const TOTAL_QUESTIONS = 120;

type ExamState = 'loading' | 'ready' | 'in-progress' | 'reviewing' | 'submitting' | 'done';

export default function ExamPage() {
  const router = useRouter();
  const [state, setState] = useState<ExamState>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60);
  const [startTime, setStartTime] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [licenseTrack, setLicenseTrack] = useState('CGC');
  const [error, setError] = useState('');
  const [showCalc, setShowCalc] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Load user + questions
  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data: profile } = await supabase
        .from('users')
        .select('license_track, access_expires_at')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.access_expires_at || new Date(profile.access_expires_at) < new Date()) {
        router.push('/dashboard?expired=true');
        return;
      }

      setUserId(user.id);
      setLicenseTrack(profile.license_track);

      try {
        const qs = await fetchExamQuestions(profile.license_track);
        setQuestions(qs);
        setState('ready');
      } catch (e: any) {
        setError(e.message);
      }
    }
    init();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (state !== 'in-progress') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); doSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  function startExam() {
    setStartTime(Date.now());
    setState('in-progress');
  }

  function selectAnswer(questionId: string, answer: string) {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }

  function requestSubmit() {
    if (state === 'submitting' || state === 'done') return;
    const hasFlagged = Object.values(flagged).some(Boolean);
    if (hasFlagged) { setState('reviewing'); return; }
    doSubmit();
  }

  const doSubmit = useCallback(async () => {
    if (state === 'submitting' || state === 'done') return;
    setState('submitting');
    const timeSeconds = Math.round((Date.now() - startTime) / 1000);
    try {
      const result = await saveExamAttempt({ userId, licenseTrack, questions, answers, timeSeconds });
      router.push(`/exam/results?attempt=${result.attemptId}`);
    } catch (e: any) {
      setError(e.message);
      setState('in-progress');
    }
  }, [state, userId, licenseTrack, questions, answers, startTime]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const q = questions[current];

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary">Back to Dashboard</button>
      </div>
    </div>
  );

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your exam...</p>
    </div>
  );

  if (state === 'ready') return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-navy mb-2">Florida {licenseTrack} B&F Exam</h1>
        <p className="text-gray-500 mb-6">120 questions · Blueprint-weighted · 6.5 hours</p>
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          {[['120','Questions'],['6.5 hrs','Time Limit'],['70%','Passing Score']].map(([val, label]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-3">
              <div className="text-xl font-bold text-blue-700">{val}</div>
              <div className="text-blue-600">{label}</div>
            </div>
          ))}
        </div>
        <button onClick={startExam} className="w-full bg-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition">
          Start Exam
        </button>
      </div>
    </div>
  );

  if (state === 'reviewing') {
    const flaggedQuestions = questions.filter(q => flagged[q.id]);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🚩</span>
              <h1 className="text-2xl font-black text-navy">Review Flagged Questions</h1>
            </div>
            <p className="text-gray-500 mb-8">
              You flagged {flaggedQuestions.length} question{flaggedQuestions.length !== 1 ? 's' : ''} for review.
              Jump back to any of them or submit when ready.
            </p>

            <div className="space-y-3 mb-8">
              {flaggedQuestions.map((fq, i) => {
                const qIndex = questions.findIndex(q => q.id === fq.id);
                const answered = !!answers[fq.id];
                return (
                  <div key={fq.id} className="flex items-start gap-4 p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">
                    <span className="text-amber-500 font-black text-sm mt-0.5 w-6 flex-shrink-0">
                      #{qIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium line-clamp-2">{fq.question_text}</p>
                      <p className={`text-xs mt-1 font-semibold ${answered ? 'text-green-600' : 'text-red-500'}`}>
                        {answered ? `Answered: ${answers[fq.id]}` : 'Not answered'}
                      </p>
                    </div>
                    <button
                      onClick={() => { setCurrent(qIndex); setState('in-progress'); }}
                      className="flex-shrink-0 text-xs font-bold text-navy border-2 border-navy px-3 py-1.5 rounded-lg hover:bg-navy hover:text-white transition"
                    >
                      Jump Back
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setState('in-progress')}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 transition"
              >
                ← Back to Exam
              </button>
              <button
                onClick={doSubmit}
                className="flex-1 py-3 bg-navy text-white rounded-xl font-bold hover:bg-blue-900 transition"
              >
                Submit Exam →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header bar */}
      <div className="bg-navy text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="font-bold text-sm">ContractorPrep Pro · {licenseTrack} B&F</div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline">{answeredCount} / {TOTAL_QUESTIONS} answered</span>
          <span className={`font-mono font-bold ${timeLeft < 1800 ? 'text-red-300' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => { setShowNotepad(v => !v); setShowCalc(false); }}
            className={`px-3 py-1.5 rounded-lg font-bold text-sm transition ${showNotepad ? 'bg-yellow-400 text-navy' : 'bg-white/20 text-white hover:bg-white/30'}`}
            title="Notepad"
          >
            📝
          </button>
          <button
            onClick={() => { setShowCalc(v => !v); setShowNotepad(false); }}
            className={`px-3 py-1.5 rounded-lg font-bold text-sm transition ${showCalc ? 'bg-yellow-400 text-navy' : 'bg-white/20 text-white hover:bg-white/30'}`}
            title="Calculator"
          >
            🧮
          </button>
          <button
            onClick={requestSubmit}
            disabled={state === 'submitting'}
            className="bg-white text-navy px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition disabled:opacity-50"
          >
            {state === 'submitting' ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-6 p-6">
        {/* Question panel */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400 font-medium">Question {current + 1} of {questions.length}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFlagged(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  title={flagged[q?.id] ? 'Remove flag' : 'Flag for review'}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 transition ${
                    flagged[q?.id]
                      ? 'bg-amber-400 border-amber-400 text-white'
                      : 'border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500'
                  }`}
                >
                  🚩 {flagged[q?.id] ? 'Flagged' : 'Flag for Review'}
                </button>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  Area {q?.dbpr_area}
                </span>
              </div>
            </div>

            <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">
              {q?.question_text}
            </p>

            <div className="space-y-3">
              {(['A','B','C','D'] as const).map(letter => {
                const text = q?.[`option_${letter.toLowerCase()}` as keyof Question] as string;
                const selected = answers[q?.id] === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => selectAnswer(q.id, letter)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition font-medium ${
                      selected
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    <span className={`inline-block w-7 h-7 rounded-full text-sm font-bold text-center leading-7 mr-3 ${
                      selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>{letter}</span>
                    {text}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                className="px-6 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-gray-300 disabled:opacity-30 transition"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                disabled={current === questions.length - 1}
                className="px-6 py-2 bg-navy text-white rounded-xl font-semibold hover:bg-blue-900 disabled:opacity-30 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Question navigator */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-4 sticky top-24">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Navigator</p>
            <div className="grid grid-cols-6 gap-1">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrent(i)}
                  className={`h-7 w-full rounded text-xs font-bold transition ${
                    i === current
                      ? 'bg-navy text-white'
                      : flagged[q.id]
                      ? 'bg-amber-400 text-white'
                      : answers[q.id]
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-100 inline-block"/>{answeredCount} answered</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-100 inline-block"/>{questions.length - answeredCount} remaining</div>
              {Object.values(flagged).filter(Boolean).length > 0 && (
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-400 inline-block"/>{Object.values(flagged).filter(Boolean).length} flagged</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showNotepad && <Notepad onClose={() => setShowNotepad(false)} />}
    </div>
  );
}
