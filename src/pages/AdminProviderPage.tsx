import { PageHeader } from "../components/ui/PageHeader";
import { useAppContext } from "../context/AppContext";

export function AdminProviderPage() {
  const { allMatches, currentProfile } = useAppContext();
  const submitted = currentProfile.applications.filter((application) => application.stage === "Submitted").length;

  return (
    <div className="space-y-8">
      <PageHeader
        description="This mock provider surface shows how scholarship managers could see applicant quality, common blockers, and document readiness trends without a backend."
        eyebrow="Admin / scholarship provider"
        title="Provider-side view of scholarship quality, bottlenecks, and applicant flow."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Scholarships tracked", value: allMatches.length },
          { label: "Submitted applications", value: submitted },
          { label: "Top blocker", value: "Recommendation letters" },
          { label: "Quality signal", value: `${allMatches[0]?.score ?? 0}% best fit` }
        ].map((stat) => (
          <div className="panel p-5" key={stat.label}>
            <p className="label-caps text-on-surface-2">{stat.label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-on-surface">{stat.value}</h2>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <p className="label-caps text-on-surface-2 mb-4">Scholarship provider insights</p>
          <ul className="space-y-3 text-sm leading-7 text-on-surface-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Applicants with uploaded SOPs move into "Almost eligible" much faster.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              IELTS and recommendation letters are the most repeated unlock actions.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Need-aware scholarships gain clarity when students explicitly mark funding interest.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Students with certifications in relevant domains score 8–15% higher on field fit.
            </li>
          </ul>
        </div>

        <div className="panel p-6">
          <p className="label-caps text-on-surface-2 mb-4">Mock provider controls</p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Publish scholarship update", desc: "Push changes to the live scholarship listing" },
              { label: "Review applicant funnel", desc: "See where students drop off in the pipeline" },
              { label: "Export eligibility gaps", desc: "Download common blockers as a CSV report" },
              { label: "Tune document requirements", desc: "Adjust required docs and their weighting" }
            ].map((item) => (
              <div
                className="rounded-xl border border-outline bg-surface-low p-4"
                key={item.label}
              >
                <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                <p className="text-xs text-on-surface-2 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <p className="label-caps text-on-surface-2 mb-4">Top scholarships by match quality</p>
        <div className="space-y-2">
          {allMatches.slice(0, 6).map((m) => (
            <div
              key={m.scholarship.id}
              className="flex items-center gap-4 py-2.5 border-b border-outline last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{m.scholarship.name}</p>
                <p className="text-xs text-on-surface-2 mt-0.5">{m.scholarship.country} · {m.scholarship.fundingType}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary">{m.score}%</p>
                <p className="text-xs text-on-surface-2">{m.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
