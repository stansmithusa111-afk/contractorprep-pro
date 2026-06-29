import { createClient } from './supabase/client';

export type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  dbpr_area: string;
  source_ref: string | null;
  is_pretest?: boolean;
};

export type AreaScores = Record<string, number>;

const PRETEST_COUNT = 5;

export async function fetchExamQuestions(licenseTrack: string): Promise<Question[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('draw_exam_questions', {
    p_track: licenseTrack,
  });
  if (error) throw new Error(error.message);

  const shuffled = (data as Question[]).sort(() => Math.random() - 0.5);

  // Randomly designate 5 questions as unscored pretest items at draw time
  const pretestIndices = new Set<number>();
  while (pretestIndices.size < PRETEST_COUNT) {
    pretestIndices.add(Math.floor(Math.random() * shuffled.length));
  }

  return shuffled.map((q, i) => ({ ...q, is_pretest: pretestIndices.has(i) }));
}

export async function saveExamAttempt({
  userId, licenseTrack, questions, answers, timeSeconds,
}: {
  userId: string;
  licenseTrack: string;
  questions: Question[];
  answers: Record<string, string>;
  timeSeconds: number;
}) {
  const supabase = createClient();

  let correct = 0;
  const areaScores: AreaScores = { A:0, B:0, C:0, D:0, E:0, F:0 };
  const areaTotals: AreaScores = { A:0, B:0, C:0, D:0, E:0, F:0 };

  const attemptAnswers = questions.map(q => {
    const selected = answers[q.id] || null;
    const isCorrect = selected === q.correct_answer;
    // Pretest questions are recorded but excluded from scoring and area tallies
    if (!q.is_pretest) {
      if (isCorrect) { correct++; areaScores[q.dbpr_area]++; }
      areaTotals[q.dbpr_area]++;
    }
    return { question_id: q.id, selected_answer: selected, is_correct: isCorrect };
  });

  const scoredCount = questions.filter(q => !q.is_pretest).length;
  const score = Math.round((correct / scoredCount) * 100);

  const { data: attempt, error: attemptError } = await supabase
    .from('exam_attempts')
    .insert({ user_id: userId, license_track: licenseTrack, score, total_questions: scoredCount, time_seconds: timeSeconds, area_scores: areaScores })
    .select('id').single();

  if (attemptError) throw new Error(attemptError.message);

  const { error: answersError } = await supabase
    .from('attempt_answers')
    .insert(attemptAnswers.map(a => ({ ...a, attempt_id: attempt.id })));

  if (answersError) throw new Error(answersError.message);

  return { attemptId: attempt.id, score, areaScores, areaTotals };
}
