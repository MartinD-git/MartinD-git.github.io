# Martin Daigne — personal portfolio

A single-page portfolio built with Astro, TypeScript, and custom CSS. Projects live in Markdown; the site builds to static files for free GitHub Pages hosting at **https://martin.daigne.com**. There is no backend, client UI framework, or external CMS.

Fonts are self-hosted, with their licenses retained in `public/licenses/`.

## Local development

Use **Node.js 22.23.4 or newer**.

```bash
npm ci
npm run dev
```

Open **http://localhost:4321**. Changes to content and styles refresh automatically. Local development never deploys to production. To preview CV edits as well, install the [local CV tooling](#update-the-cv) once; the dev server then regenerates the PDF on startup and whenever the CV YAML or design files change.

To check the production output:

```bash
npm run check
npm run build
npm test
npm run preview
```

`npm run build` writes `dist/`. The preview also uses port 4321; stop the development server before starting it. Run `npm run format` before committing and `npm run format:check` to check formatting.

## Where things live

| Location                       | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `src/content/projects/*.md`    | One file per project                                             |
| `src/data/site.ts`             | Home text, position, links, categories, and manual update date   |
| `src/data/skills.ts`           | Editable skill groups                                            |
| `src/data/courses.ts`          | Courses grouped by subject                                       |
| `src/assets/`                  | Portrait and project images, optimized by Astro                  |
| `public/projects/<project>/`   | Videos, PDFs, and other unchanged project files                  |
| `src/components/`              | Gallery, project details, and small SVG icons                    |
| `src/pages/index.astro`        | Single-page layout and metadata                                  |
| `src/styles/global.css`        | Palette, typography, layout, responsive behavior, reduced motion |
| `src/scripts/portfolio.ts`     | Filtering, previews, dialog behavior, active navigation          |
| `_data/cv.yml`                 | The existing CV source, independent of website content           |
| `assets/rendercv/`             | Existing CV design, locale, settings, and fallback PDF           |
| `assets/source/`               | Original personal images, animations, and presentation           |
| `scripts/prepare-public.mjs`   | Copies the latest CV to its existing download URL                |
| `scripts/render-cv.mjs`        | Renders the CV and keeps its local development download current  |
| `.github/workflows/deploy.yml` | Builds, verifies, and deploys only from `main`                   |

Original personal media is retained in `assets/source/` for future editing. Astro does not publish that folder. Project reports live directly in `public/projects/` alongside their videos. The old Jekyll theme, demo files, and Ruby/Docker tooling have been removed.

## Add a project

1. Copy [`examples/project.md`](examples/project.md) to `src/content/projects/my-project.md`.
2. Put images in `src/assets/projects/my-project/` and videos or PDFs in `public/projects/my-project/`.
3. Replace the example metadata and Markdown with factual content. Remove `draft: true` when ready.
4. Run the checks above, inspect the local preview, and commit the Markdown and media.

The gallery finds every non-draft Markdown file automatically. No component changes or project pages are needed.

Each file starts with YAML metadata between `---` lines:

```yaml
---
title: Your project title
year: 2026
categories: [machine-learning, robotics]
order: 9
overview: A concise explanation of your project.
thumbnail:
  src: ../../assets/projects/my-project/thumbnail.webp
  alt: A meaningful description of the image
  fit: cover
preview: /projects/my-project/preview.mp4
github: https://github.com/your-account/your-repository
report: /projects/my-project/report.pdf
---
```

`title`, `year`, `categories`, and `overview` are required. `year` accepts a number or a string, such as `2024–2026`. Lower `order` values appear first; it defaults to 100. Set `draft: true` to hide an entry. Drafts are still validated, so referenced files must exist.

All media and links are optional. Omit absent fields rather than leaving them blank. Without a thumbnail, the gallery displays the project title and **Project image to add**. `fit: contain` preserves a whole diagram; `cover` fills the rectangle. Every thumbnail and gallery image requires descriptive `alt` text.

Keep the Markdown body brief: a sentence under `## Goal`, two or three bullets under `## Highlights`, and an optional short `## Results`. Use only the headings you need; link the full report for detail. On desktop, this summary sits beside the main media, with additional media in a two-column gallery below. On phones, the content stacks vertically. Reports and external links open in a new tab, identified in their accessible labels.

### Media gallery

Add a `media` array to the frontmatter:

```yaml
media:
  - type: image
    src: ../../assets/projects/my-project/photo.webp
    alt: What the image shows
    caption: An optional short caption.
  - type: video
    src: /projects/my-project/demo.mp4
    alt: What the video demonstrates
    poster: ../../assets/projects/my-project/poster.webp
```

Images use paths relative to the Markdown file. Public videos and PDFs use root-relative URLs without `public/`. Images, including animated GIFs, are supported; optimized H.264 MP4 is recommended for animations. Use MP4 for `preview`. Media stays in inert HTML templates until its modal is opened. Videos use native controls and `preload="none"`.

To replace a thumbnail, overwrite its source image or change `thumbnail.src` in that project's Markdown. Images retain their original colors, with no tint or overlay. Titles appear beneath the images on desktop hover or keyboard focus, and remain visible on mobile. `cover` fills the tile edge to edge; reserve `contain` for diagrams or models that must remain uncropped. To replace a hover animation, replace the MP4 or edit `preview`. When both an image and a video are supplied, use the image for `thumbnail` and the video for `preview`. A video-only project can use a still frame as its thumbnail. Playback pauses during fade-out and resets on the next hover. Previews are disabled for reduced motion, data-saving connections, and touch input. An unavailable preview leaves the still visible.

The supplied media has been organized into project folders. Original images and GIFs remain in `assets/source/`; original MP4s and reports live in `public/projects/`. Website images use optimized WebP files. The soft-arm model image is rotated 90 degrees for a landscape view, while its source PNG is unchanged. Hover previews use compact MP4s; the diffusion animation was converted from GIF. `Gust_video.jpg` was a still photo and is included as an image in the gust-generator details. The language-model charts were extracted from the supplied report. No project imagery was fabricated.

### Categories

Edit the `categories` array in `src/data/site.ts`:

- Change a `label` to rename a filter without updating projects.
- Reorder the array to reorder filters.
- Add a stable `id` and label to add a category, then use that ID in project frontmatter.
- Remove an ID from the relevant projects before removing the category from the array.

**All** is supplied automatically. A project can have multiple category IDs. Invalid IDs fail the build with a content validation error.

## Home, skills, courses, and footer

Edit Home text, current position, social links, the optional footer note, and footer links in `src/data/site.ts`. Update `updated` manually when content changes; it is never replaced with the build date.

Home text supports Markdown links such as `[label](https://example.com)` and paragraphs separated by a blank line.

Replace `src/assets/portrait.webp` to change the portrait. The current asset is the original profile illustration, not a photograph. Update its alt text in `src/pages/index.astro` when replacing it.

Edit skill groups in `src/data/skills.ts` and course groups in `src/data/courses.ts`. Both use simple `{ title, items }` objects. Course order follows the data file. The coursework panel scrolls independently and is keyboard focusable; on mobile it follows the skills vertically. Add only skills and courses you want to claim publicly.

### Content that still needs your input

- Completion years for mobile robotics and Wikispeedia, intentionally kept as **Year to confirm** for you to fill later.
- A photograph if you want to replace the original illustrated portrait.

The ten project entries were adapted from the original project pages, `_data/cv.yml`, and the supplied project reports. Carrot peeler (2022) and post-training small language models (2026) use the supplied reports; their descriptions refer to team work without inventing individual contributions. Skills come from the original sources; the 48 course entries were supplied by Martin and grouped by subject, with French titles translated to English. The current position was provided in the redesign brief; no employer was added. CV content and website content remain intentionally separate. Earlier page descriptions remain available in Git history.

## Update the CV

Continue editing **`_data/cv.yml`**. The website never duplicates the CV as HTML.

Every production build regenerates the PDF before building the website, then copies it to the existing public URL:

```text
/assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf
```

The CV icon always points there. A render failure fails deployment, preventing a newly deployed site from silently serving an old PDF. A separate **Render a CV** workflow produces a downloadable Actions artifact on YAML or design changes on any branch; it does not auto-commit or deploy.

Install the local CV tooling once:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-cv.txt
```

`npm run dev` uses `.venv/bin/rendercv` automatically (or `rendercv` on your `PATH`). It regenerates the CV when starting and after edits to `_data/cv.yml` or its settings, design, and locale files, then refreshes the downloadable copy without restarting the server. Render errors appear in the terminal and keep the last successful PDF available.

To render manually or update a production preview:

```bash
npm run cv
npm run build
npm run preview
```

RenderCV may download official Typst packages on the first run. The pinned renderer is in `requirements-cv.txt`. The separate design and locale files are passed explicitly; the old command did not load their references from the settings overlay. Although the unused design file previously specified `engineeringclassic`, the published PDF used the `classic` defaults. `design.yaml` now explicitly matches that published appearance: `classic`, US Letter, blue accents, footer, and update note.

`npm run cv` updates both the PDF in `assets/rendercv/rendercv_output/` and its public download immediately. A production preview serves `dist/`, so rebuild it after CV edits. The checked-in PDF remains a fallback for local development without Python, with a terminal notice that CV edits require RenderCV. Production always uses a fresh render and does not depend on that fallback being up to date.

## GitHub Pages deployment

Keep development on **`redesign`**. Production is unchanged until the redesign is approved and merged into `main`.

The **Deploy site** workflow:

1. Builds and checks pushes to `redesign` and `main`, and pull requests into `main`.
2. Generates the CV, builds Astro, runs the interaction/local-link tests, and uploads `portfolio-preview` as an Actions artifact.
3. Publishes `dist/` to **`gh-pages` only when the triggering ref is `main` and the event is not a pull request**. Manual dispatch on `redesign` also cannot deploy.

Keep the repository's existing Pages source: **Deploy from a branch → `gh-pages` → `/ (root)`**. No hosting migration or paid service is required. `public/CNAME` preserves `martin.daigne.com`; `astro.config.mjs` uses that domain with no base path. `public/.nojekyll` preserves Astro's `_astro/` files on Pages. Do not change DNS for this redesign.

The deployment build checks local links and media through `npm test`. The formatting workflow uses the locked dependencies. The optional manual **Axe accessibility testing** workflow builds and scans the static site. CodeQL checks JavaScript and TypeScript. Obsolete theme workflows have been removed.

Do not merge or manually run a production deployment until the redesign is approved.

## Verification

`npm run check` validates Astro and TypeScript. `npm run build` validates project metadata and image references. `npm test` runs ten tests against the actual built HTML: filtering and multiple categories, empty categories, every project modal, Escape cancellation and outside clicks, focus restoration, scroll locking, preview loading/reset/failure, reduced motion/data saving/touch behavior, active navigation, optional fields, the CV, and all local media links inside modal templates. It also verifies that the output contains only one HTML page and the custom domain files.

The tests use jsdom and mock the native dialog and media APIs. They do **not** verify browser layout, native focus containment, actual video playback, or actual Escape-key delivery. Before approving production, inspect the local preview at desktop, tablet, and phone widths; check pointer hover, keyboard Tab/Shift+Tab, Escape, backdrop dismissal, page-position preservation, course scrolling, and the CV download. Check reduced-motion behavior in browser accessibility settings. Run the optional Axe workflow for a browser accessibility scan.

Firefox visual QA was completed on Ubuntu using Playwright CLI at widths from 320 to 1440 pixels, including a separate touch/coarse-pointer context. Screenshots were inspected for desktop, phone, tablet, gallery, and modal views. Browser checks covered original image colors, titles beneath thumbnails, still-to-video transitions, real hover-video playback and restart, every category filter, touch activation, Escape and backdrop dismissal, initial/returned focus, inert background controls, independent modal/course scrolling, scroll preservation, reduced motion, and optional project content. A separately served production build also passed filtering, keyboard modal activation, real video decoding, and Escape/focus restoration with no JavaScript errors. These were browser emulations, not physical-device tests.
