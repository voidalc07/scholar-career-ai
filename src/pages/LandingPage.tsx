import { useNavigate } from "react-router-dom";

const HERO_IMG = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80";
const STUDY_IMG = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80";
const LIBRARY_IMG = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80";
const CAMPUS_IMG = "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&auto=format&fit=crop&q=80";

const steps = [
  {
    num: "01",
    title: "Build your profile",
    body: "Tell us about your academics, finances, and goals. Takes under 5 minutes."
  },
  {
    num: "02",
    title: "Get AI-matched scholarships",
    body: "Our engine scores every scholarship against your profile in real time."
  },
  {
    num: "03",
    title: "Apply with confidence",
    body: "Use the built-in builder, tracker, and document vault to stay organised."
  }
];

const stats = [
  { value: "50,000+", label: "Scholarships indexed" },
  { value: "$2.1B+", label: "Funding available" },
  { value: "94%", label: "Match accuracy" },
  { value: "12,000+", label: "Students matched" }
];

const testimonials = [
  {
    name: "Anika R.",
    from: "India → University of Edinburgh",
    quote: "I found 3 scholarships I'd never heard of. The AI picked up my community work and matched it to funding I actually qualified for.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
  },
  {
    name: "Kwame O.",
    from: "Ghana → University of Toronto",
    quote: "The eligibility map told me exactly what to fix. Six weeks later I had a fully funded offer.",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
  },
  {
    name: "Mia L.",
    from: "Vietnam → TU Munich",
    quote: "The document vault kept everything in one place. My application process was actually enjoyable.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=80"
  }
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-display">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-outline">
        <div className="max-w-screen-lg mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-on-surface">Scholar Career</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium text-on-surface-2 hover:text-on-surface transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-on-surface px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Get started free
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end">
        <img
          src={HERO_IMG}
          alt="Graduation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-screen-lg mx-auto px-6 pb-20 w-full">
          <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-4">AI Scholarship Matching</p>
          <h1 className="text-white text-5xl md:text-6xl font-semibold leading-tight max-w-2xl" style={{ letterSpacing: "-0.02em" }}>
            Find the scholarship<br />built for you.
          </h1>
          <p className="text-white/70 text-lg mt-5 max-w-md leading-relaxed">
            Your profile, scored against 50,000+ scholarships. Know exactly what you qualify for — and what to fix.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-white text-on-surface px-6 py-3 text-sm font-semibold hover:bg-surface-low transition-colors"
            >
              Start matching — free
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-white/30 text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Explore the app
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-on-surface text-white">
        <div className="max-w-screen-lg mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-white/50 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="max-w-screen-lg mx-auto px-6 py-24">
        <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-2 mb-3">How it works</p>
        <h2 className="text-3xl font-semibold text-on-surface mb-16" style={{ letterSpacing: "-0.02em" }}>
          From profile to offer, in three steps.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.num}>
              <p className="text-4xl font-bold text-outline mb-6">{step.num}</p>
              <h3 className="text-base font-semibold text-on-surface mb-2">{step.title}</h3>
              <p className="text-sm text-on-surface-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE PHOTOS BENTO */}
      <section className="max-w-screen-lg mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Large card */}
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-auto">
            <img src={STUDY_IMG} alt="Student studying" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-white text-lg font-semibold">AI Eligibility Map</p>
              <p className="text-white/70 text-sm mt-1">See exactly what's blocking each scholarship and how to fix it.</p>
            </div>
          </div>
          {/* Two small cards */}
          <div className="grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-40">
              <img src={LIBRARY_IMG} alt="Library" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white text-sm font-semibold">Document Vault</p>
                <p className="text-white/70 text-xs mt-0.5">AI reviews your SOP and CV for scholarship fit.</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-40">
              <img src={CAMPUS_IMG} alt="Campus" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white text-sm font-semibold">Application Tracker</p>
                <p className="text-white/70 text-xs mt-0.5">Kanban-style pipeline from discovery to offer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface-low py-24">
        <div className="max-w-screen-lg mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-2 mb-3">Student stories</p>
          <h2 className="text-3xl font-semibold text-on-surface mb-12" style={{ letterSpacing: "-0.02em" }}>
            Real students, real offers.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-card">
                <p className="text-sm text-on-surface leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="h-9 w-9 rounded-full object-cover bg-surface-container" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">{t.name}</p>
                    <p className="text-xs text-on-surface-2">{t.from}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-screen-lg mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold text-on-surface mb-4" style={{ letterSpacing: "-0.02em" }}>
          Your scholarship is out there.
        </h2>
        <p className="text-on-surface-2 mb-8 max-w-sm mx-auto">
          Build your profile in minutes and see which scholarships you qualify for today.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="rounded-lg bg-on-surface text-white px-8 py-3.5 text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          Get started — it's free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-outline py-8">
        <div className="max-w-screen-lg mx-auto px-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-medium text-on-surface">Scholar Career</p>
          <p className="text-xs text-on-surface-2">© 2026 Scholar Career. AI-powered scholarship discovery.</p>
        </div>
      </footer>
    </div>
  );
}
