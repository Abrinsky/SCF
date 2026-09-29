# Sioux City Foundry Co. - Sample redesign

This repository hosts a **sample marketing site redesign** for [Sioux City Foundry Co.](https://www.siouxcityfoundry.com/), published for demonstration on GitHub Pages.

**Live demo:** https://abrinsky.github.io/SCF/

## Important

- This is **not** the official corporate website.
- Copy and claims are limited to publicly documented facts provided for this sample.
- Fabrication as a standalone division is closed (2026) and is not featured as live.
- No ISO 9001, ASME/DOT/API tank certification, or active Hardox/SSAB partnership claims.
- Stock Book tables on this site are **illustrative categories only**. Live inventory lives in the official PDF.

## Pages

| Page | Path |
|------|------|
| Home | `/` / `index.html` |
| Divisions | `divisions.html` |
| Stock Book | `stock-book.html` |
| About | `about.html` |
| News | `news.html` |
| Careers | `careers.html` |
| Job detail | `job.html?id=...` |
| Contact | `contact.html` |

## Stack

Static HTML, CSS, and small JS helpers. Official logos under `assets/`. Content lists for news and jobs live under `data/` as JSON. Base path for GitHub Project Pages is `/SCF/`.

## Editing news (JSON)

Homepage strip and `news.html` both load `/SCF/data/news.json`.

1. Open `data/news.json`.
2. Add an object: `{ "id", "title", "date", "summary", "href", "image?" }` (`image` is optional).
3. Use absolute site paths like `/SCF/about.html` for internal links, or full `https://...` URLs for external ones.
4. Remove an object (or delete the file entry) to take it off the site.
5. Commit and push to `main`. GitHub Pages redeploys.

Dates sort newest first. Keep copy claim-safe (no invented certs or partnerships). Prefer periods/commas/parentheses over em/en dashes in user-facing text.

## Editing jobs (JSON, Lasso-like publish flag)

`careers.html` loads `/SCF/data/jobs.json` and shows **only** items with `"published": true`. Each published title links to the ungated local detail route `/SCF/job.html?id=...`; the detail page reads the same JSON file.

1. Open `data/jobs.json`.
2. Add: `{ "id", "title", "department", "location", "type", "summary", "detailHref", "detail", "applyEmail", "applyHref", "published", "posted" }`. Use `detailHref` like `/SCF/job.html?id=your-id`; rich `detail` fields include `description`, `shift`, `supervisor`, `requiredExperience`, `otherRequirements`, `education`, `yearsExperience`, `payRate`, `requiredDocuments`, HR contact fields, and `notes`.
3. Set `"published": true` to go live on the Careers page (sample stand-in for the FileMaker checkbox). Set `false` to hide without deleting.
4. Keep pay copy labeled as sample, illustrative, or BOE-style demo. Real hiring still goes through the [official employment page](https://www.siouxcityfoundry.com/employ.lasso).
5. Commit and push to `main`.

## Official Stock Book

https://www.siouxcityfoundry.com/stockbook_view.pdf

## Local preview

Any static server from the repo root works. Paths assume `/SCF/`, so for local root serving you may temporarily rewrite or open via a `/SCF` mount.

Example:

```bash
npx --yes serve -p 4173
# then visit paths under a /SCF prefix, or adjust links for local-only testing
```

## License

See `LICENSE` in this repository. Company names, logos, and trademarks remain property of their respective owners. This sample is for portfolio / demo use associated with the Abrinsky/SCF repo.
