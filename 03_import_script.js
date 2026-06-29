// ============================================================
// ContractorPrep Pro — Bulk Question Import Script
// Run with: node 03_import_script.js
// ============================================================
// SETUP:
// 1. npm install @supabase/supabase-js
// 2. Add your Supabase URL and SERVICE ROLE key below
//    (service role key bypasses RLS for admin imports)
// 3. Place your question JSON file alongside this script
// ============================================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL     = 'https://sbeuocngduhwxpmrjnsd.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_IBxiFc92UmwzmS1oXkhJrw_dspxL5Ve'; // from Supabase > Settings > API

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================
// QUESTION FORMAT
// Your JSON file should be an array of objects like this:
// ============================================================
// [
//   {
//     "question_text": "What is the current ratio formula?",
//     "option_a": "...",
//     "option_b": "...",
//     "option_c": "...",
//     "option_d": "...",
//     "correct_answer": "A",   // must be A, B, C, or D
//     "dbpr_area": "D",        // must be A, B, C, D, E, or F
//     "license_track": "ALL",  // ALL | CGC | CBC | CRC
//     "source_ref": "BGA Ch.3",
//     "difficulty": 2          // 1 | 2 | 3
//   }
// ]

async function importQuestions(jsonFilePath) {
  const fs = require('fs');
  const questions = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  console.log(`Importing ${questions.length} questions...`);

  // Validate required fields before hitting the DB
  const required = ['question_text','option_a','option_b','option_c','option_d','correct_answer','dbpr_area'];
  const validAreas   = new Set(['A','B','C','D','E','F']);
  const validAnswers = new Set(['A','B','C','D']);
  const validTracks  = new Set(['ALL','CGC','CBC','CRC']);

  const errors = [];
  questions.forEach((q, i) => {
    required.forEach(field => {
      if (!q[field]) errors.push(`Row ${i+1}: missing ${field}`);
    });
    if (q.dbpr_area && !validAreas.has(q.dbpr_area))
      errors.push(`Row ${i+1}: invalid dbpr_area "${q.dbpr_area}" — must be A-F`);
    if (q.correct_answer && !validAnswers.has(q.correct_answer))
      errors.push(`Row ${i+1}: invalid correct_answer "${q.correct_answer}" — must be A-D`);
    if (q.license_track && !validTracks.has(q.license_track))
      errors.push(`Row ${i+1}: invalid license_track "${q.license_track}"`);
  });

  if (errors.length > 0) {
    console.error('Validation errors found:');
    errors.forEach(e => console.error(' ', e));
    process.exit(1);
  }

  // Apply defaults
  const prepared = questions.map(q => ({
    ...q,
    license_track: q.license_track || 'ALL',
    difficulty:    q.difficulty    || 2,
    is_active:     true,
  }));

  // Import in batches of 100 to avoid timeouts
  const BATCH = 100;
  let imported = 0;

  for (let i = 0; i < prepared.length; i += BATCH) {
    const batch = prepared.slice(i, i + BATCH);
    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
      console.error(`Batch ${Math.floor(i/BATCH)+1} failed:`, error.message);
      process.exit(1);
    }
    imported += batch.length;
    console.log(`  ${imported} / ${prepared.length} imported...`);
  }

  console.log(`\nImport complete: ${imported} questions added.`);

  // Print area breakdown
  const { data: counts } = await supabase
    .from('questions')
    .select('dbpr_area')
    .eq('is_active', true);

  if (counts) {
    const breakdown = counts.reduce((acc, q) => {
      acc[q.dbpr_area] = (acc[q.dbpr_area] || 0) + 1;
      return acc;
    }, {});
    const total = counts.length;
    console.log('\nCurrent question bank distribution:');
    const areaNames = { A:'Establishing Business', B:'Administrative', C:'Operations', D:'Accounting', E:'HR', F:'Government' };
    const targets   = { A:11, B:26, C:10, D:32, E:6, F:15 };
    Object.keys(areaNames).sort().forEach(area => {
      const count = breakdown[area] || 0;
      const pct   = ((count / total) * 100).toFixed(1);
      const target = targets[area];
      const flag   = Math.abs(pct - target) > 5 ? ' ⚠️' : ' ✓';
      console.log(`  Area ${area} (${areaNames[area]}): ${count} questions (${pct}%) — target ${target}%${flag}`);
    });
  }
}

// Run: node 03_import_script.js questions.json
const file = process.argv[2];
if (!file) {
  console.error('Usage: node 03_import_script.js <path-to-questions.json>');
  process.exit(1);
}
importQuestions(file);
