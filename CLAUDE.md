# ContractorPrep Pro — Project Instructions

## Project Status (as of June 2026)
- Next.js 14 app built and running locally at localhost:3000
- Supabase project: "Exam Prep" (sbeuocngduhwxpmrjnsd.supabase.co)
- 500 B&F questions imported and tagged with DBPR content areas (A–F)
- Auth working: signup, login, dashboard, exam page
- Project location: C:\Users\stans\Documents\contractorprep-pro\contractorprep

## Tech Stack
- Frontend: Next.js 14, Tailwind CSS
- Backend: Supabase (auth, database, RLS)
- Deployment: Vercel (not yet deployed)
- Payments: Stripe (not yet integrated)

## Next Build Steps
1. Fix login auto-redirect to dashboard (session cookie issue resolved — cache clear fixed it)
2. Test full exam flow (start → questions → submit → results)
3. Stripe integration + access expiry logic
4. Landing page
5. Deploy to Vercel

---

## Question Bank Generation Instructions

### Project Context
Florida contractor exam prep site targeting CGC, CBC, CRC license candidates.
The existing 500-question B&F bank was built from the ABC 2025 Florida Contractors
Manual, Builder's Guide to Accounting (BGA), and AIA documents (A201, A401, A701).

Questions are tagged with DBPR content areas:
- A = Establishing Business   (11% target / 13 questions per 120-question exam)
- B = Administrative Duties   (26% target / 31 questions)
- C = Trade Operations        (10% target / 12 questions)
- D = Accounting Functions    (32% target / 38 questions)
- E = Human Resources         ( 6% target /  8 questions)
- F = Government Regulations  (15% target / 18 questions)

Current bank distribution (500 questions imported):
- Area A: 50 questions (10%) ✓
- Area B: 135 questions (27%) ✓
- Area C: 0 questions (0%) ⚠️ — gap fill questions pending audit
- Area D: 220 questions (44%) ⚠️ heavy but functional
- Area E: 0 questions (0%) ⚠️ — gap fill questions pending audit
- Area F: 95 questions (19%) ✓

### Before Starting Any Question Batch
1. List reference files and confirm readable vs. scanned/image-only
2. Confirm with Stan: question count, grouping, structure, citation format
3. Don't assume prior structure carries over — confirm first each session

### Handling Reference Material
- Check file type first. Some PDFs are text-extractable; others (BGA-AIA files)
  are scanned and need rasterization via pdftoppm
- Watch for non-standard page order — BGA-AIA_4.pdf was scanned in reverse order
- Cite real sources only — chapter/section/page from actual document
- Never fabricate citations

### Critical Working Style
- Answer from direct reference knowledge when possible
- Don't re-extract files already read in the session
- Batch efficiently — read a chapter once, generate multiple questions from it
- Save .docx and .json checkpoints after each batch to protect progress

### Question Import Format (for Supabase via 03_import_script.js)
Every question must follow this exact JSON structure:

{
  "question_text": "Question goes here",
  "option_a": "First answer choice",
  "option_b": "Second answer choice",
  "option_c": "Third answer choice",
  "option_d": "Fourth answer choice",
  "correct_answer": "A",      // must be A, B, C, or D
  "dbpr_area": "D",           // must be A, B, C, D, E, or F
  "license_track": "ALL",     // ALL | CGC | CBC | CRC
  "source_ref": "BGA Ch. 3 — Job Costing",
  "difficulty": 2             // 1=easy, 2=medium, 3=hard
}

Import command:
  node 03_import_script.js your_questions.json
  (Run from C:\Users\stans\Documents\contractorprep-pro\contractorprep)

### Output Formatting (docx question banks)
- Navy/blue styling, correct answers highlighted green
- Source citation under each question
- Answer key appendix at end
- Save .docx and .json checkpoints after each batch

---

## Pending Items

### Question Bank
- [ ] Accuracy audit of Qwen set (~804 questions) against reference books
- [ ] Accuracy audit of 100 gap-fill questions (Areas A and C) against reference books
- [ ] Import audited Qwen + gap-fill questions once verified
- [ ] Upload reference books for verification audit

### Site Build
- [ ] Confirm login auto-redirect works consistently
- [ ] Test full exam flow end to end (start → submit → results page)
- [ ] Stripe integration (one-time payment, webhook, access grant)
- [ ] 6-month access expiry + 90-day extension option
- [ ] Landing/marketing page
- [ ] Deploy to Vercel
- [ ] Add flashcard feature (90-card set already built — BF_Flashcards.jsx)
- [ ] CBC and CRC track questions (Phase 2)
- [ ] Continuing education (Phase 2)

---

## Key Files
- questions_500.json — imported B&F question bank
- 03_import_script.js — bulk question importer
- 01_schema_v2.sql — Supabase schema (already run)
- BF_Exam_Flashcards.docx — printable flashcard set
- BF_Flashcards.jsx — interactive flashcard React component
- BF_Gap_Questions_Areas_A_and_C.docx — 100 gap-fill questions (pending audit)
