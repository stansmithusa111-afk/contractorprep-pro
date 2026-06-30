import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Built by a Florida Contractor.<br className="hidden sm:block" /> For Florida Contractors.
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Real exam prep, built from firsthand experience.
          </p>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-2xl mx-auto space-y-8 text-gray-700">

          <p className="text-lg leading-relaxed">
            ContractorPrep Pro was built out of firsthand experience with the Florida contractor
            licensing exam — the confusion, the time pressure, the challenge of studying across
            multiple reference books while managing a real schedule.
          </p>

          <p className="leading-relaxed">
            The Business &amp; Finance exam is the gateway to your CGC, CBC, or CRC license.
            It&apos;s 120 scored questions, 6.5 hours, open-book — but open-book only helps if
            you know where to look. The clock is the real challenge.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
            <h2 className="font-black text-navy text-lg mb-4">Our Approach</h2>
            {[
              'Blueprint-weighted practice exams that mirror the real DBPR exam structure',
              'Questions drawn from the same reference books tested on the actual exam — Florida Contractors Manual, Builder\'s Guide to Accounting, AIA A201/A401/A701',
              'Score breakdowns by content area so you know exactly where to focus your study time — not just a total percentage',
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="leading-relaxed">
            Our goal is simple: give Florida contractors the most realistic, most targeted exam
            prep available, so they walk in confident and walk out licensed.
          </p>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="font-black text-navy text-lg mb-3">Questions or Feedback?</h2>
            <p className="text-gray-600">
              Reach us at{' '}
              <span className="text-navy font-semibold">[contact email coming soon]</span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-navy text-white text-center">
        <div className="max-w-md mx-auto">
          <p className="text-blue-200 mb-5">Ready to start preparing?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/exam/sample" className="bg-white text-navy px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
              Try 10 Free Questions
            </Link>
            <Link href="/auth/signup" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 border border-blue-500 transition">
              Get Full Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
