import Link from 'next/link';

export default function BFPage() {
  const areas = [
    { code: 'D', name: 'Accounting Functions', pct: '32%', questions: '38' },
    { code: 'B', name: 'Administrative Duties', pct: '26%', questions: '31' },
    { code: 'F', name: 'Government Regulations', pct: '15%', questions: '18' },
    { code: 'A', name: 'Establishing Business', pct: '11%', questions: '13' },
    { code: 'C', name: 'Trade Operations', pct: '10%', questions: '12' },
    { code: 'E', name: 'Human Resources', pct: '6%', questions: '8' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Required for CGC · CBC · CRC
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Business &amp; Finance Exam
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Every Florida contractor license requires passing the B&amp;F exam. This is what ContractorPrep Pro is built for.
          </p>
        </div>
      </section>

      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              ['120', 'Scored Questions'],
              ['6.5 hrs', 'Time Limit'],
              ['70%', 'Passing Score'],
            ].map(([val, label]) => (
              <div key={label} className="bg-white rounded-2xl shadow p-6 text-center">
                <div className="text-3xl font-black text-navy mb-1">{val}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-black text-navy mb-1">Exam Blueprint</h2>
            <p className="text-sm text-gray-500 mb-5">DBPR content areas and their weighting on the 120-question exam.</p>
            <div className="space-y-3">
              {areas.map(({ code, name, pct, questions }) => (
                <div key={code}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">
                      <span className="inline-block bg-navy text-white text-xs px-1.5 py-0.5 rounded mr-2 font-bold">{code}</span>
                      {name}
                    </span>
                    <span className="text-gray-500 font-semibold">{questions} questions · {pct}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-black text-navy mb-4">What to Expect</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                '5 additional unscored pretest items are embedded in the exam (not counted in your score)',
                'Questions drawn from Florida contractor law, AIA contract documents, and accounting principles',
                'The same format and weighting as the actual DBPR-administered exam',
                'Calculator provided during the real exam — and built into ContractorPrep Pro',
                'Administered by Pearson VUE at testing centers statewide',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-navy text-white text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black mb-2">Practice the Real Thing</h2>
          <p className="text-blue-200 mb-6">500+ question bank, blueprint-weighted, with instant scoring by content area.</p>
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
