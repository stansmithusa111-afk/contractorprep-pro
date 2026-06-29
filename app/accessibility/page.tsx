import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Accessibility</h1>
          <p className="text-gray-500">
            ContractorPrep Pro is designed to be usable by all candidates preparing for the Florida
            contractor Business &amp; Finance exam.
          </p>
        </div>

        {/* Keyboard Navigation */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-black text-navy">Keyboard Navigation</h2>
          <p className="text-gray-600 text-sm">
            All interactive elements are reachable and operable without a mouse.
          </p>
          <div className="space-y-2">
            {[
              ['Tab / Shift+Tab', 'Move focus between buttons, links, and inputs'],
              ['Enter / Space', 'Activate the focused button or select an answer'],
              ['Arrow keys', 'Navigate answer choices when focused'],
              ['Escape', 'Close the calculator or notepad panel'],
            ].map(([key, desc]) => (
              <div key={key} className="flex gap-4 items-start text-sm">
                <kbd className="flex-shrink-0 bg-gray-100 border border-gray-300 text-gray-700 font-mono px-2 py-1 rounded text-xs whitespace-nowrap">
                  {key}
                </kbd>
                <span className="text-gray-600 pt-0.5">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screen Reader Support */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-3">
          <h2 className="text-lg font-black text-navy">Screen Reader Support</h2>
          <p className="text-gray-600 text-sm">
            This site uses semantic HTML elements and ARIA labels where appropriate. It has been
            tested with common screen reader and browser combinations including NVDA with Chrome and
            VoiceOver with Safari.
          </p>
          <p className="text-gray-600 text-sm">
            Answer choices are labeled with their letter and full text. Question progress (e.g.,
            "Question 5 of 120") is announced on navigation. The countdown timer is visible on screen
            but does not auto-announce — candidates relying on screen readers should note their start
            time and manage pacing manually.
          </p>
          <p className="text-gray-600 text-sm">
            If you encounter a screen reader issue, please{' '}
            <a href="mailto:support@contractorpreppro.com" className="text-navy font-semibold hover:underline">
              contact us
            </a>{' '}
            and we will address it promptly.
          </p>
        </div>

        {/* Exam Timer */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-3">
          <h2 className="text-lg font-black text-navy">Exam Timer</h2>
          <p className="text-gray-600 text-sm">
            The full practice exam uses a <span className="font-semibold">6.5-hour (390-minute)</span> countdown
            timer, matching the time limit of the real DBPR Business &amp; Finance exam. This is intentional —
            practicing under realistic time conditions helps build pacing awareness for the actual test.
          </p>
          <p className="text-gray-600 text-sm">
            The timer turns red when under 30 minutes remain. The exam auto-submits when time expires.
          </p>
          <p className="text-gray-600 text-sm">
            The free 10-question sample exam at{' '}
            <Link href="/exam/sample" className="text-navy font-semibold hover:underline">/exam/sample</Link>{' '}
            has no timer and can be used at your own pace.
          </p>
        </div>

        {/* DBPR Accommodations */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-black text-navy">DBPR Testing Accommodations</h2>
          <p className="text-gray-700 text-sm">
            The Florida Department of Business and Professional Regulation (DBPR) offers testing
            accommodations for candidates with documented disabilities, including extended time.
            ContractorPrep Pro does not currently offer a configurable timer — our exam mirrors
            the standard 6.5-hour window.
          </p>
          <p className="text-gray-700 text-sm">
            If you have been approved for extended time or other accommodations by DBPR, we recommend
            using the practice exam as a content review tool rather than a timed simulation, and
            mentally adjusting for your approved additional time on exam day.
          </p>
          <p className="text-gray-700 text-sm">
            To request accommodations from DBPR, contact the exam provider directly:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 pl-4 list-disc">
            <li>Visit the DBPR website at <span className="font-semibold">myfloridalicense.com</span></li>
            <li>Contact Pearson VUE (the DBPR exam administrator) for accommodation requests</li>
            <li>Submit documentation well in advance of your scheduled exam date</li>
          </ul>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/" className="text-sm text-navy font-semibold hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
