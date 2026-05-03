import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

type SortKey = "match" | "deadline" | "amount";

// Keys must match exact `country` values in mockScholarships.ts
const LOCATION_OPTIONS = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Sweden",
  "Ireland",
  "Japan",
  "Singapore"
];
const LOCATION_LABELS: Record<string, string> = {
  "United Kingdom": "UK",
  "United States": "USA",
  Canada: "Canada",
  Australia: "Australia",
  Germany: "Germany",
  Netherlands: "Netherlands",
  Sweden: "Sweden",
  Ireland: "Ireland",
  Japan: "Japan",
  Singapore: "Singapore"
};

// Keys must match exact `degreeLevel` values in mockScholarships.ts
const EDUCATION_OPTIONS = ["Undergraduate", "Master's", "PhD", "Career switcher"];
const STATUS_OPTIONS = ["All", "Eligible now", "Almost eligible", "Needs improvement", "Not eligible yet"];

export function ScholarshipMatchingPage() {
  const navigate = useNavigate();
  const { allMatches, toggleSaveScholarship, currentProfile } = useAppContext();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [matchStatus, setMatchStatus] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");

  const toggleLocation = (loc: string) =>
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );

  const toggleLevel = (level: string) =>
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );

  const clearAll = () => {
    setSelectedLocations([]);
    setSelectedLevels([]);
    setMatchStatus("All");
    setMinAmount("");
    setMaxAmount("");
    setQuery("");
  };

  const filtered = useMemo(() => {
    let results = allMatches.filter((result) => {
      const matchesQuery =
        result.scholarship.name.toLowerCase().includes(query.toLowerCase()) ||
        result.scholarship.provider.toLowerCase().includes(query.toLowerCase());

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(result.scholarship.country);

      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(result.scholarship.degreeLevel);

      const matchesStatus = matchStatus === "All" || result.status === matchStatus;

      const min = minAmount ? parseInt(minAmount, 10) : 0;
      const max = maxAmount ? parseInt(maxAmount, 10) : Infinity;
      const matchesAmount =
        result.scholarship.amountValue >= min &&
        result.scholarship.amountValue <= max;

      return matchesQuery && matchesLocation && matchesLevel && matchesStatus && matchesAmount;
    });

    if (sortKey === "match") {
      results = [...results].sort((a, b) => b.score - a.score);
    } else if (sortKey === "amount") {
      results = [...results].sort((a, b) => b.scholarship.amountValue - a.scholarship.amountValue);
    } else if (sortKey === "deadline") {
      results = [...results].sort((a, b) =>
        a.scholarship.deadline.localeCompare(b.scholarship.deadline)
      );
    }

    return results;
  }, [query, selectedLocations, selectedLevels, matchStatus, minAmount, maxAmount, sortKey, allMatches]);

  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      {/* TOP SECTION */}
      <div className="pb-6">
        <h1 className="text-3xl font-semibold text-on-surface">Discover Scholarships</h1>
        <p className="mt-2 text-on-surface-2 text-sm">
          Find scholarships, grants, and fellowships that match your profile.
        </p>

        {/* Search bar */}
        <div className="mt-5 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            className="w-full border border-outline rounded-xl pl-10 pr-4 py-3.5 text-sm bg-white text-on-surface placeholder:text-on-surface-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scholarships, providers, or keywords..."
            type="text"
            value={query}
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl elevation-1 border border-outline p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-on-surface font-semibold text-sm">Filters</h3>
              <button
                className="text-primary text-xs font-medium hover:underline"
                onClick={clearAll}
                type="button"
              >
                Clear all
              </button>
            </div>

            {/* Filter 1: Location */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2 mb-2">
                Location
              </p>
              <div className="space-y-2">
                {LOCATION_OPTIONS.map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer">
                    <input
                      checked={selectedLocations.includes(loc)}
                      className="accent-primary w-4 h-4 rounded"
                      onChange={() => toggleLocation(loc)}
                      type="checkbox"
                    />
                    <span className="text-sm text-on-surface">{LOCATION_LABELS[loc] ?? loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 2: Education Level */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2 mb-2">
                Education Level
              </p>
              <div className="flex flex-wrap gap-2">
                {EDUCATION_OPTIONS.map((level) => (
                  <button
                    key={level}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      selectedLevels.includes(level)
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface-2 hover:bg-surface-low"
                    }`}
                    onClick={() => toggleLevel(level)}
                    type="button"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Match Status */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2 mb-2">
                Match Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      matchStatus === s
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface-2 hover:bg-surface-low"
                    }`}
                    onClick={() => setMatchStatus(s)}
                    type="button"
                  >
                    {s === "Eligible now" ? "Eligible Now" : s === "Almost eligible" ? "Almost Eligible" : s === "Needs improvement" ? "Needs Work" : s === "Not eligible yet" ? "Not Eligible" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Award Amount */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2 mb-2">
                Award Amount
              </p>
              <div className="flex gap-2">
                <input
                  className="w-full border border-outline rounded-lg px-3 py-2 text-xs bg-surface-low text-on-surface placeholder:text-on-surface-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="£0"
                  type="number"
                  value={minAmount}
                />
                <input
                  className="w-full border border-outline rounded-lg px-3 py-2 text-xs bg-surface-low text-on-surface placeholder:text-on-surface-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="£50,000+"
                  type="number"
                  value={maxAmount}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT GRID */}
        <div className="lg:col-span-3">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-on-surface-2 text-sm">
              <span className="font-semibold text-on-surface">{filtered.length}</span> scholarships found
            </p>
            <select
              className="border border-outline rounded-lg px-3 py-2 text-sm bg-white text-on-surface focus:outline-none focus:border-primary"
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              value={sortKey}
            >
              <option value="match">Best Match</option>
              <option value="deadline">Deadline</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((result) => {
              const saved = currentProfile.savedScholarshipIds.includes(result.scholarship.id);
              const isAiPick = result.score >= 90;
              const providerInitial = result.scholarship.provider.charAt(0).toUpperCase();

              return (
                <div
                  className={`bg-white rounded-xl elevation-1 border border-outline p-5 flex flex-col gap-3 ${isAiPick ? "ai-glow" : ""}`}
                  key={result.scholarship.id}
                >
                  {/* Row 1: Tags + match badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {result.scholarship.tags.slice(0, 2).map((tag) => (
                        <span
                          className="bg-surface-container text-on-surface-2 text-xs px-2.5 py-1 rounded-full font-medium"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
                        result.score >= 90
                          ? "bg-ai-purple text-white"
                          : result.score >= 75
                          ? "bg-primary text-white"
                          : "bg-surface-container text-on-surface-2"
                      }`}
                    >
                      {result.score}% MATCH
                    </span>
                  </div>

                  {/* Row 2: Avatar + name + bookmark */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-2 font-bold text-sm flex items-center justify-center shrink-0">
                      {providerInitial}
                    </div>
                    <p className="font-semibold text-on-surface text-sm leading-snug line-clamp-2 flex-1">
                      {result.scholarship.name}
                    </p>
                    <button
                      aria-label={saved ? "Unsave scholarship" : "Save scholarship"}
                      className={`cursor-pointer mt-0.5 shrink-0 transition-colors ${saved ? "text-primary" : "text-on-surface-2 hover:text-primary"}`}
                      onClick={() => { toggleSaveScholarship(result.scholarship.id); showToast(saved ? "Removed from saved" : "Saved to your list", "success"); }}
                      type="button"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                  </div>

                  {/* Row 3: Amount + funding type */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-primary font-bold text-xl">{result.scholarship.amountLabel}</span>
                    <span className="text-on-surface-2 text-xs">{result.scholarship.fundingType}</span>
                  </div>

                  {/* Row 4: Deadline + country */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-on-surface-2 text-xs">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      {result.scholarship.deadline}
                    </span>
                    <span className="flex items-center gap-1.5 text-on-surface-2 text-xs">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
                      </svg>
                      {result.scholarship.country}
                    </span>
                  </div>

                  {/* Row 5: Missing criteria warning */}
                  {result.missingCriteria.length > 0 && (
                    <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
                      Missing: {result.missingCriteria.slice(0, 2).join(", ")}
                      {result.missingCriteria.length > 2 && ` +${result.missingCriteria.length - 2} more`}
                    </div>
                  )}

                  {/* Row 6: Action buttons */}
                  <div className="flex gap-2 mt-auto pt-1">
                    <button
                      className="flex-1 bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
                      onClick={() => navigate(`/scholarship/${result.scholarship.id}`)}
                      type="button"
                    >
                      View Details
                    </button>
                    <button
                      className={`border rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        saved
                          ? "border-primary text-primary bg-primary/5"
                          : "border-outline text-on-surface-2 hover:border-primary hover:text-primary"
                      }`}
                      onClick={() => { toggleSaveScholarship(result.scholarship.id); showToast(saved ? "Removed from saved" : "Saved to your list", "success"); }}
                      type="button"
                    >
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="md:col-span-2 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="text-on-surface font-semibold">No scholarships found</p>
                <p className="text-on-surface-2 text-sm mt-1">Try adjusting your filters or search query.</p>
                <button className="mt-4 text-primary text-sm font-medium hover:underline" onClick={clearAll} type="button">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
