import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // draw_exam_questions is SECURITY DEFINER so it bypasses RLS
  const { data, error } = await supabase.rpc('draw_exam_questions', { p_track: 'ALL' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sample = (data as any[])
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map(({ id, question_text, option_a, option_b, option_c, option_d, correct_answer, dbpr_area, source_ref }) => ({
      id, question_text, option_a, option_b, option_c, option_d, correct_answer, dbpr_area, source_ref,
    }));

  return NextResponse.json(sample);
}
