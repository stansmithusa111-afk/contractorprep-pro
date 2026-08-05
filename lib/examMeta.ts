import { createClient } from './supabase/client';

export const EXAM_LABELS: Record<string, string> = {
  'B&F': 'Business & Finance',
  CA: 'Contract Administration',
  PM: 'Project Management',
};

export type AreaBlueprint = {
  dbpr_area: string;
  area_name: string;
  weight_pct: number;
  target_count: number;
};

export type ExamBlueprint = {
  exam: string;
  licenseType: string;
  scoredCount: number;
  pretestCount: number;
  totalCount: number;
  timeLimitMinutes: number;
  areas: AreaBlueprint[];
};

/**
 * Fetches blueprint weights/targets/time-limit live from Supabase (exam_config +
 * exam_blueprints) rather than hardcoding them client-side, so the UI can never drift
 * from what draw_exam_questions() actually generates. exam_config has one row per
 * (exam, license_type) for exams whose length varies by license type (CA/PM), or a
 * single license_type='ALL' row for exams that don't (B&F) -- mirrors the same
 * exact-match-then-fall-back-to-ALL lookup draw_exam_questions() uses server-side.
 */
export async function getExamBlueprint(exam: string, licenseType: string): Promise<ExamBlueprint> {
  const supabase = createClient();
  const [{ data: configRows, error: configError }, { data: weights, error: weightsError }] = await Promise.all([
    supabase.from('exam_config').select('*').eq('exam', exam).in('license_type', [licenseType, 'ALL']),
    supabase.from('exam_blueprints').select('*').eq('exam', exam).order('dbpr_area'),
  ]);

  if (configError || !configRows || configRows.length === 0) throw new Error(`Unknown exam: ${exam}`);
  if (weightsError || !weights) throw new Error(`No blueprint weights found for exam: ${exam}`);

  const config = configRows.find(r => r.license_type === licenseType) ?? configRows.find(r => r.license_type === 'ALL');
  if (!config) throw new Error(`No exam_config row for ${exam}/${licenseType}`);

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
    licenseType,
    scoredCount: config.scored_count,
    pretestCount: config.pretest_count,
    totalCount: config.scored_count + config.pretest_count,
    timeLimitMinutes: config.time_limit_minutes,
    areas,
  };
}
