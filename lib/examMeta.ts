import { createClient } from './supabase/client';

export const EXAM_LABELS: Record<string, string> = {
  'B&F': 'Business & Finance',
  CA: 'Contract Administration',
  PM: 'Project Management',
};

// Real per-exam time limits aren't published by DBPR with the same precision as the
// blueprint weights (unlike B&F's 6.5-hour limit, which is DBPR-documented). 180 minutes
// is the most consistently cited figure for the 60-question CA/PM portions across
// secondary sources -- treat as provisional until confirmed against an official source.
export const EXAM_TIME_MINUTES: Record<string, number> = {
  'B&F': 390,
  CA: 180,
  PM: 180,
};

export type AreaBlueprint = {
  dbpr_area: string;
  area_name: string;
  weight_pct: number;
  target_count: number;
};

export type ExamBlueprint = {
  exam: string;
  scoredCount: number;
  pretestCount: number;
  totalCount: number;
  areas: AreaBlueprint[];
};

/**
 * Fetches blueprint weights/targets live from Supabase (exam_config + exam_blueprints)
 * rather than hardcoding them client-side, so the UI can never drift from what
 * draw_exam_questions() actually generates.
 */
export async function getExamBlueprint(exam: string): Promise<ExamBlueprint> {
  const supabase = createClient();
  const [{ data: config, error: configError }, { data: weights, error: weightsError }] = await Promise.all([
    supabase.from('exam_config').select('*').eq('exam', exam).single(),
    supabase.from('exam_blueprints').select('*').eq('exam', exam).order('dbpr_area'),
  ]);

  if (configError || !config) throw new Error(`Unknown exam: ${exam}`);
  if (weightsError || !weights) throw new Error(`No blueprint weights found for exam: ${exam}`);

  const areas: AreaBlueprint[] = weights.map(w => ({
    dbpr_area: w.dbpr_area,
    area_name: w.area_name,
    weight_pct: Number(w.weight_pct),
    target_count: Math.round((Number(w.weight_pct) / 100) * config.scored_count),
  }));

  const total = areas.reduce((sum, a) => sum + a.target_count, 0);
  const delta = config.scored_count - total;
  if (delta !== 0) {
    const maxArea = [...areas].sort(
      (a, b) => b.weight_pct - a.weight_pct || a.dbpr_area.localeCompare(b.dbpr_area)
    )[0];
    maxArea.target_count += delta;
  }

  return {
    exam,
    scoredCount: config.scored_count,
    pretestCount: config.pretest_count,
    totalCount: config.scored_count + config.pretest_count,
    areas,
  };
}
