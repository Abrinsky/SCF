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
| Careers | `careers.html` |
| Contact | `contact.html` |

## Stack

Static HTML, CSS, and a small JS nav helper. Official logos under `assets/`. Base path for GitHub Project Pages is `/SCF/`.

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
