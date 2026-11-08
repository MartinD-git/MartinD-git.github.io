# Martin Daigne’s portfolio

This is a static, single-page Astro portfolio with TypeScript and custom CSS, hosted on free GitHub Pages. See [README.md](README.md) for setup, content editing, and deployment.

## Source files

- `src/content/projects/*.md`: project metadata and concise Markdown descriptions.
- `src/data/`: Home text, social links, categories, skills, courses, and the manual update date.
- `src/components/`, `src/pages/`, `src/styles/`, `src/scripts/`: presentation and browser interactions.
- `src/assets/`: images optimized by Astro.
- `public/projects/`: published project videos and reports.
- `assets/source/`: original personal media for future editing; not published.
- `_data/cv.yml`: the editable CV source, separate from website content.
- `assets/rendercv/`: CV settings, design, locale, and the fallback PDF.
- `.github/workflows/`: build, CV rendering, formatting, accessibility, and CodeQL checks.

## Working rules

- Develop on `redesign`. Do not merge into `main` or deploy to production without explicit approval.
- Keep `martin.daigne.com`, the existing CV download URL, and GitHub Pages hosting intact.
- Keep changes focused and dependencies limited. Use native HTML, CSS, and browser APIs where practical.
- Do not invent projects, biographical details, achievements, skills, or project years.
- Preserve the CV’s appearance and YAML source. Do not duplicate CV content in HTML.
- Check references before removing content or assets. Keep original personal media available for editing.
- Keep the gallery and native project dialogs keyboard accessible, responsive, and compatible with reduced motion.
- Do not add the future robotics illustration without approval.

## Verification

Run `npm run format:check`, `npm run check`, `npm run build`, and `npm test`. Tests read `dist/`, so build first. For UI changes, use the configured Playwright CLI with Firefox and inspect desktop and mobile screenshots. Local development runs with `npm run dev` at `http://127.0.0.1:4321`.

Stage specific files. Use conventional commit subjects such as `feat:`, `fix:`, `docs:`, or `chore:`. Do not commit dependencies, generated site output, local browser artifacts, or credentials.
