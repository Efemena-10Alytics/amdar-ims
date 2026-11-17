# Amdari HR Dashboard

Recruitment dashboard for hiring managers: hiring overview, open roles,
applicants and the create-a-job flow.

Standalone Next.js app that currently lives inside the `amdar-ims` repo and is
meant to be split out into its own repository later. It has its own
`package.json`, `node_modules` and toolchain; the parent repo excludes this
folder from its TypeScript and ESLint runs.

## Running it

```bash
cd hr-dashboard
npm install
npm run dev     # http://localhost:3100
```

The port is pinned to 3100 so it can run alongside amdar-ims on 3000.

## Routes

| Route | What it is |
|---|---|
| `/` | Hiring overview — metrics, pipeline, open roles, recent applicants, interviews |
| `/jobs/create` | Create a job, with a live candidate preview |
| `/open-roles`, `/applicants`, `/interviews`, `/reports`, `/hiring-team` | Placeholders, not yet designed |

## Notes

- Content is static placeholder data in `src/components/dashboard/data.ts`,
  matching the Figma board. No API is wired up yet.
- The Application overview chart is deliberately an empty frame, pending the
  charting pass.
- Fonts (Sora Variable, Clash Display) and the colour palette match amdar-ims.
