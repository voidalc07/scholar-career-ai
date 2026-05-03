import { useNavigate } from "react-router-dom";
import { countryStrategies } from "../data/strategy";
import { useAppContext } from "../context/AppContext";

const COUNTRY_FLAGS: Record<string, string> = {
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  Netherlands: "🇳🇱",
  Sweden: "🇸🇪",
  Ireland: "🇮🇪"
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Low: "bg-success-light text-success",
  Medium: "bg-amber-50 text-warning",
  High: "bg-red-50 text-danger"
};

const FUNDING_COLOR: Record<string, string> = {
  High: "bg-success-light text-success",
  Medium: "bg-amber-50 text-warning",
  Low: "bg-red-50 text-danger"
};

function difficultyClass(value: string): string {
  if (/easy|low/i.test(value)) return DIFFICULTY_COLOR.Low;
  if (/moderate|medium/i.test(value)) return DIFFICULTY_COLOR.Medium;
  if (/hard|high|complex/i.test(value)) return DIFFICULTY_COLOR.High;
  return "bg-surface-low text-on-surface-2";
}

function fundingClass(value: string): string {
  if (/high|abundant|strong/i.test(value)) return FUNDING_COLOR.High;
  if (/medium|moderate/i.test(value)) return FUNDING_COLOR.Medium;
  if (/low|limited/i.test(value)) return FUNDING_COLOR.Low;
  return "bg-surface-low text-on-surface-2";
}

export function CourseCountryStrategyPage() {
  const navigate = useNavigate();
  const { currentProfile, visibleMatches } = useAppContext();
  const targetCountry = currentProfile.personal.targetCountry;
  const focusStrategy = countryStrategies.find((s) => s.country === targetCountry) ?? countryStrategies[0];

  const courseCounts = [currentProfile.courseGoals.preferredSubject, "Data Science", "Public Policy", "Business Analytics"]
    .filter((c, i, arr) => c && arr.indexOf(c) === i)
    .map((course) => ({
      course,
      count: visibleMatches.filter((m) =>
        m.scholarship.fields.some((field) => field.toLowerCase().includes(course.toLowerCase()))
      ).length
    }));

  const countryRanking = countryStrategies
    .map((s) => ({
      ...s,
      matches: visibleMatches.filter((m) => m.scholarship.country === s.country).length
    }))
    .sort((a, b) => b.matches - a.matches);

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* Header */}
      <div className="border-b border-outline pb-5">
        <p className="label-caps text-primary">Strategy</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Course & country strategy</h1>
        <p className="mt-2 text-sm text-on-surface-2 max-w-2xl">
          Compare destinations by scholarship depth, living cost, visa difficulty, and post-study work — then map them to your active profile.
        </p>
      </div>

      {/* AI recommendation hero */}
      <section className="rounded-2xl border border-outline bg-gradient-to-br from-white to-surface-low p-6 elevation-1">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-ai-purple text-xl">✦</span>
          <div className="flex-1">
            <p className="label-caps text-on-surface-2">Recommended strategy</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">
              {COUNTRY_FLAGS[focusStrategy.country] ?? "🎓"} {focusStrategy.country} for {currentProfile.courseGoals.preferredSubject}
            </h2>
          </div>
        </div>
        <p className="text-sm text-on-surface-2 leading-relaxed mb-4 max-w-3xl">
          Based on your target degree, current match scores, and document readiness, {focusStrategy.country} gives the best balance of scholarship availability, manageable visa complexity, and post-study work potential.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <div className="rounded-lg bg-white border border-outline p-3">
            <p className="text-[10px] font-semibold uppercase text-on-surface-2 tracking-wider">Funding depth</p>
            <p className="text-sm font-semibold text-on-surface mt-1">{focusStrategy.fundingAvailability}</p>
          </div>
          <div className="rounded-lg bg-white border border-outline p-3">
            <p className="text-[10px] font-semibold uppercase text-on-surface-2 tracking-wider">Work options</p>
            <p className="text-sm font-semibold text-on-surface mt-1">{focusStrategy.workOpportunity}</p>
          </div>
          <div className="rounded-lg bg-white border border-outline p-3">
            <p className="text-[10px] font-semibold uppercase text-on-surface-2 tracking-wider">Top match country</p>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {countryRanking[0]?.country ?? "—"} ({countryRanking[0]?.matches ?? 0})
            </p>
          </div>
        </div>
      </section>

      {/* Country grid */}
      <section>
        <h2 className="text-base font-semibold text-on-surface mb-4">Compare destinations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countryRanking.map((s) => {
            const isTarget = s.country === targetCountry;
            return (
              <div
                key={s.id}
                className={`rounded-xl bg-white p-5 border transition-shadow hover:shadow-card ${isTarget ? "border-primary shadow-card" : "border-outline"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{COUNTRY_FLAGS[s.country] ?? "🌍"}</span>
                    <h3 className="text-base font-semibold text-on-surface">{s.country}</h3>
                  </div>
                  {isTarget && (
                    <span className="text-[10px] font-semibold text-primary bg-primary-container px-2 py-0.5 rounded-full">Target</span>
                  )}
                </div>

                <p className="text-xs text-on-surface-2 leading-relaxed mb-4">{s.bestFor}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-2">Living cost</span>
                    <span className="text-on-surface font-medium">{s.livingCost}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-2">Visa</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyClass(s.visaDifficulty)}`}>{s.visaDifficulty}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-2">Funding</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${fundingClass(s.fundingAvailability)}`}>{s.fundingAvailability}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline flex items-center justify-between">
                  <span className="text-xs text-on-surface-2">{s.matches} matches</span>
                  <button
                    type="button"
                    onClick={() => navigate("/scholarship-matching")}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Browse →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course compare */}
      <section className="panel p-6">
        <p className="label-caps text-on-surface-2 mb-4">Course depth in your matches</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {courseCounts.map(({ course, count }) => (
            <div key={course} className="rounded-xl border border-outline bg-surface-low p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-1">{course}</h3>
              <p className="text-xs text-on-surface-2">
                <span className="text-base font-bold text-primary">{count}</span> scholarships matched
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
