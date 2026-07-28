# Scholar Career AI

A scholarship discovery and application platform for international students, built with my team at **Claude Hackathon 2026**. Build a profile, set what matters to you, and get a ranked list of scholarships with a transparent score breakdown, the criteria you are missing, and the concrete actions that would unlock a higher match.

- **Profile and preferences.** A profile builder plus a 7-step preferences wizard (goals, countries and courses, funding, eligibility flexibility, effort and timeline, career outcomes, match weights) drives everything downstream.
- **Weighted matching engine.** Every scholarship gets a score built from 7 dimensions: eligibility, academic, field, country, funding, effort, and deadline fit. The weights are user-adjustable with sliders, so a student who cares about funding over prestige gets a different ranking from one who cares about deadlines.
- **Explainable results, not just a number.** Each match shows its full score breakdown, the specific criteria not yet met, up to 5 unlock actions with an estimated improved score, difficulty, time to unlock, and a suggested next best action.
- **Application workflow.** Eligibility map, per-scholarship detail pages, an improvement plan, a course and country strategy view, a document vault, an application builder, and a Kanban-style application tracker.
- **42 realistic scholarship records** (Chevening, Commonwealth, DAAD-style awards and more) covering the UK, Canada, Germany, Australia, the Netherlands, Sweden and beyond.

## How the matching works

`src/utils/matching.ts` scores each scholarship against the student profile and preferences:

1. Hard eligibility checks first (education level, nationality, test scores against per-test ceilings such as IELTS 9.0 or GRE 340).
2. Soft fit dimensions are scored and scaled by the user's weight sliders.
3. Missing criteria are converted into ranked unlock actions, each with an estimated score improvement, so the result is a plan rather than a rejection.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Vitest. Single-page app with Vercel config in place (`vercel.json`). All data is currently in-repo mock data; `VITE_API_BASE_URL` in `.env.example` is the seam for a future backend.

## Run locally

```bash
npm install
npm run dev        # start the dev server
npm run test       # run the vitest suite
npm run build      # type-check and build for production
```

## Project structure

| Path | Responsibility |
|---|---|
| `src/pages/` | 21 routed pages, from landing and sign-up through matching, tracking, and admin |
| `src/utils/matching.ts` | The weighted scoring and unlock-action engine |
| `src/data/` | Mock scholarships, profiles, preference options, and strategy content |
| `src/components/` | Layout and UI components including the Kanban board and weight sliders |
| `src/lib/query.ts` | Query-string builder for opportunity search, with unit tests |

## Roadmap

- Finish the production deployment on Vercel
- Replace mock data with a real backend behind `VITE_API_BASE_URL`
- Persist profiles and application state
- Expand the test suite beyond the query builder to the matching engine

## Credits

Built at Claude Hackathon 2026.
