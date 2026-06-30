import Link from 'next/link';

export default function ResidentialPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-navy text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            CRC · Certified Residential Contractor
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Florida Residential Contractor License
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            The go-to license for home builders and remodelers across Florida.
          </p>
        </div>
      </section>

      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-black text-navy mb-4">Scope of Work</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'One and two-family residences',
                'Townhouses up to three stories',
                'Accessory structures appurtenant to residences',
                'Remodeling, additions, and renovations within scope',
                'May subcontract specialty trades within scope',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-black text-navy mb-4">Who It&apos;s For</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Home builders and custom home contractors',
                'Remodelers and renovation specialists',
                'Contractors focused exclusively on residential work',
                'Those entering the construction field through homebuilding',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 sm:col-span-2">
            <h2 className="text-lg font-black text-navy mb-4">What the Exam Covers</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Business &amp; Finance (B&amp;F)</p>
                <ul className="space-y-1.5">
                  {[
                    '120 scored questions · 6.5 hour time limit · 70% to pass',
                    'Accounting Functions (32% of exam)',
                    'Administrative Duties (26%)',
                    'Government Regulations (15%)',
                    'Establishing Business (11%)',
                    'Trade Operations (10%)',
                    'Human Resources (6%)',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Trade Knowledge</p>
                <ul className="space-y-1.5">
                  {[
                    'Florida Residential Building Code',
                    'Wood-frame construction and foundations',
                    'Roofing systems and weather-resistant barriers',
                    'Energy code compliance',
                    'Permits and residential inspections',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-navy text-white text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black mb-2">Start Preparing Today</h2>
          <p className="text-blue-200 mb-6">ContractorPrep Pro covers the full B&amp;F exam — required for every CRC candidate.</p>
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
