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

const LICENSE_TRACK_TO_SCOPE: Record<string, string> = {
  CGC: 'GC',
  CBC: 'BC',
  CRC: 'RC',
};

export function licenseTrackToScope(licenseTrack: string): string {
  const scope = LICENSE_TRACK_TO_SCOPE[licenseTrack];
  if (!scope) throw new Error(`Unknown license_track: ${licenseTrack}`);
  return scope;
}

export async function fetchExamQuestions(
  exam: string,
  licenseTrack: string,
  userId?: string
): Promise<Question[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('draw_exam_questions', {
    p_exam: exam,
    p_license_type: licenseTrackToScope(licenseTrack),
    p_user_id: userId ?? null,
  });
  if (error) throw new Error(error.message);

  // Order is already randomized server-side (blueprint-weighted per area, then
  // shuffled across areas) -- no client-side reshuffling needed.
  return data as Question[];
}

export async function saveExamAttempt({
  exam, userId, licenseTrack, questions, answers, timeSeconds,
}: {
  exam: string;
  userId: string;
  licenseTrack: string;
  questions: Question[];
  answers: Record<string, string>;
  timeSeconds: number;
}) {
  const supabase = createClient();

  let correct = 0;
  const areas = Array.from(new Set(questions.map(q => q.dbpr_area)));
  const areaScores: AreaScores = Object.fromEntries(areas.map(a => [a, 0]));
  const areaTotals: AreaScores = Object.fromEntries(areas.map(a => [a, 0]));

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
    .insert({ user_id: userId, exam, license_track: licenseTrack, score, total_questions: scoredCount, time_seconds: timeSeconds, area_scores: areaScores })
    .select('id').single();

  if (attemptError) throw new Error(attemptError.message);

  const { error: answersError } = await supabase
    .from('attempt_answers')
    .insert(attemptAnswers.map(a => ({ ...a, attempt_id: attempt.id })));

  if (answersError) throw new Error(answersError.message);

  return { attemptId: attempt.id, score, areaScores, areaTotals };
}
