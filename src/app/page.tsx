import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="font-semibold text-lg text-gray-900">CloseCycle</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
          Your monthly close cycle,<br />
          <span className="text-primary">at a glance.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Stop chasing clients through email and spreadsheets. CloseCycle turns your monthly close workflow into
          a visual grid — one click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90"
          >
            Start Free Trial
          </Link>
          <Link
            href="#how-it-works"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50"
          >
            How It Works
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">One Grid to Rule Them All</h3>
              <p className="text-gray-600">See every client&apos;s monthly close status — Not Started, Awaiting Docs, Complete — all in one place.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Reminders</h3>
              <p className="text-gray-600">Set it once. CloseCycle automatically emails your clients when documents are due, with follow-ups.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Portal</h3>
              <p className="text-gray-600">Clients get a simple, no-login link to upload documents. No passwords, no portals to learn.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Add Clients", desc: "Enter your clients and what documents you need each month." },
              { step: "2", title: "Set Reminders", desc: "Choose when reminders go out. We handle the emails." },
              { step: "3", title: "Track Status", desc: "See every client's month-end status in one visual grid." },
              { step: "4", title: "Close Fast", desc: "Mark complete. Archive. Move to next month. Repeat." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">$29/month. No annual contract.</h2>
          <p className="text-gray-600 text-lg mb-8">
            Unlike Financial Cents ($228/year upfront), TaxDome ($804/year), or Client Hub ($588/year),
            CloseCycle is $29/month — month to month. No commitment. No feature bloat. Just exactly what a
            solo bookkeeper needs.
          </p>
          <div className="inline-flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-bold text-gray-900">$29</span>
            <span className="text-gray-500 text-lg">/month</span>
          </div>
          <div className="space-y-3 text-left max-w-md mx-auto mb-10">
            {["Up to 20 clients", "Unlimited document templates", "Automated email reminders", "Client portal for document upload", "14-day free trial, no credit card"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-gray-700">{f}</span>
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CloseCycle. Built for solo bookkeepers who deserve better tools.
          </p>
        </div>
      </section>
    </div>
  );
}
