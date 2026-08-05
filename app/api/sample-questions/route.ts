import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // draw_exam_questions is SECURITY DEFINER so it bypasses RLS.
  // This is an unauthenticated public teaser -- no real user/license type yet,
  // so it uses the B&F exam with a representative license type (GC, the broadest).
  const { data, error } = await supabase.rpc('draw_exam_questions', { p_exam: 'B&F', p_license_type: 'GC' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sample = (data as any[])
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map(({ id, question_text, option_a, option_b, option_c, option_d, correct_answer, dbpr_area, source_ref }) => ({
      id, question_text, option_a, option_b, option_c, option_d, correct_answer, dbpr_area, source_ref,
    }));

  return NextResponse.json(sample);
}
