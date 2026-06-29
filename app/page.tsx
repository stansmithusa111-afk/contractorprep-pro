import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <span className="font-black text-lg tracking-tight">ContractorPrep Pro</span>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/exam/sample" className="text-blue-200 hover:text-white transition">Free Sample</Link>
          <Link href="/auth/login" className="text-blue-200 hover:text-white transition">Sign In</Link>
          <Link href="/auth/signup" className="bg-white text-navy px-4 py-1.5 rounded-lg hover:bg-blue-50 transition">Get Access</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-navy text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Florida General · Building · Residential Exam Prep
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Pass Your Florida Contractor<br className="hidden sm:block" /> B&amp;F Exam With Confidence
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Blueprint-weighted practice exams. Same format as the real test.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/exam/sample"
              className="bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
            >
              Try 10 Free Questions →
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 border border-blue-500 transition"
            >
              Get Full Access
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-blue-900 text-white py-6 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ['1,000s', 'Test Combinations'],
            ['70%', 'Passing Score'],
            ['6.5h', 'Timed Exam'],
            ['120', 'Scored Questions'],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-white">{val}</div>
              <div className="text-blue-300 text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-navy text-center mb-10">What's Included</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Free 10-Question Sample',
                desc: 'Try before you buy. Instant feedback after each answer with source references. No signup required.',
                cta: 'Start Free Sample',
                href: '/exam/sample',
                outline: true,
              },
              {
                icon: '📋',
                title: 'Full 120-Question Exam',
                desc: 'Blueprint-weighted, timed at 6.5 hours, with the same area distribution as the real DBPR exam.',
                cta: 'Get Full Access',
                href: '/auth/signup',
                outline: false,
              },
              {
                icon: '📊',
                title: 'Scored & Analyzed Results',
                desc: 'Score breakdown by all 6 DBPR content areas so you know exactly where to focus your study time.',
                cta: 'Get Full Access',
                href: '/auth/signup',
                outline: false,
              },
            ].map(({ icon, title, desc, cta, href, outline }) => (
              <div key={title} className="bg-white rounded-2xl shadow p-6 flex flex-col">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-navy text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm flex-1 mb-6">{desc}</p>
                <Link
                  href={href}
                  className={`block text-center py-2.5 rounded-xl font-bold text-sm transition ${
                    outline
                      ? 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
                      : 'bg-navy text-white hover:bg-blue-900'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-black text-navy mb-2">Simple, One-Time Pricing</h2>
          <p className="text-gray-500 mb-8">No subscription. No recurring fees.</p>

          <div className="bg-navy text-white rounded-2xl shadow-xl p-8">
            <div className="text-5xl font-black mb-1">$49</div>
            <div className="text-blue-300 text-sm mb-6">one-time · no subscription</div>

            <ul className="text-left space-y-3 mb-8 text-sm">
              {[
                '120-question blueprint-weighted practice exams',
                'Unlimited exam attempts for 180 days',
                'Instant scoring with DBPR area breakdown',
                'Pass probability estimate after each attempt',
                'Built-in calculator & notepad during exam',
                'Covers CGC, CBC, and CRC license tracks',
                '500+ question bank drawn fresh each attempt',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-blue-100">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full bg-white text-navy py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition text-center"
            >
              Get Full Access →
            </Link>
            <p className="text-blue-400 text-xs mt-3">Try 10 free questions first — no signup needed</p>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-navy font-semibold">Sign in</Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ContractorPrep Pro · Florida Contractor B&amp;F Exam Prep ·{' '}
        <Link href="/exam/sample" className="hover:text-gray-600">Free Sample</Link>
          {' · '}
          <Link href="/accessibility" className="hover:text-gray-600">Accessibility</Link>
      </footer>
    </div>
  );
}
