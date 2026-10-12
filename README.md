# Richard Muscat — Photography

A small static portfolio site: **Vue 3 + Vite + TypeScript + Tailwind CSS 4 + vue-router**.
No backend, no API keys, nothing secret anywhere in the code.

- Home: justified photo gallery (photos keep their real proportions), click for a full-screen lightbox
  with left/right arrows, keyboard (← → Esc Home End) and swipe.
- Pages: Gallery (home), About, Contact. Each open photo has its own link: `/?photo=<id>`.
- Responsive: single column on phones, denser rows on tablets and desktops.
- Photos and all page text come from two plain JSON files, read **at runtime**, so you can change
  them without rebuilding the site.

> ⚠️ **The photos currently in the site are placeholders** (Sarah Minetta's demo photos from Squarespace).
> They are someone else's work: do not publish them. Replace them (see below) before going live.

## Commands

```bash
npm install          # once
npm run dev          # local dev server with hot reload
npm run build        # typecheck + production build into dist/
npm run preview      # serve dist/ locally
npm run photos       # process photos-src/ -> public/photos + public/data/photos.json
```

Needs Node 20+ (developed on Node 22).

## Adding or replacing photos

**Option A — with the helper script (recommended)**

1. Delete the placeholder files from `public/photos/large`, `public/photos/thumb`, and remove their entries
   from `public/data/photos.json` (or just empty the `"photos"` list).
2. Put your original photos (jpg/png/webp/tiff) in `photos-src/`.
3. Run `npm run photos`.
4. Open `public/data/photos.json` and edit titles (and optionally add `"alt"` text). Order in the file = order on the site.
5. Deploy (see below).

The script makes a 2400px version (lightbox) and a 1200px version (grid) of each photo, **removes all metadata
including GPS location**, records each photo's size in the JSON, and never overwrites titles you edited.
`photos-src/` is git-ignored, so your full-size originals are not committed.

**Option B — by hand, no tools**

1. Copy the image into `public/photos/large/`. Any size or shape works. (Optional: put a smaller copy, about 1200px, with the
   same file name in `public/photos/thumb/` so the grid loads faster. If there is no thumb, the grid uses the large file.)
2. Add an entry to `public/data/photos.json`:
   ```json
   { "id": "venice-01", "file": "venice-01.jpg", "title": "Morning, Venice" }
   ```
   `id` must be unique and URL-safe (letters, numbers, dashes).
   `width`/`height` are **optional**. If you leave them out, the browser measures the photo itself and it appears a moment
   later than the rest. Don't guess them: a wrong ratio crops the photo in the grid.

You are responsible for stripping GPS/EXIF yourself with Option B. Option A does it for you.

## Editing text

Everything lives in `public/data/site.json`: name, navigation, the statement under the gallery, the About text
and portrait (`public/about_portrait.jpg`), the contact e-mail, social links (add `{ "label": "Instagram", "url": "https://…" }`
entries to `"social"`; entries with an empty url are hidden) and the footer.

## Look and feel

- Colours and fonts: `src/style.css` (`@theme` block). Background is a soft black `#121212`; change `--color-ink` to `#000` for pure black.
- Font is Jost (a sleek geometric sans), self-hosted via `@fontsource`; no Google Fonts requests. To try another (e.g. Inter, Manrope) install its `@fontsource` package and change the two `--font-*` lines in `src/style.css`.
- Logo and header: in `public/data/site.json`, `"logo"` is the image shown instead of your name (remove it to show text) and `"headerLayout"` is `"left"` (logo left, menu right) or `"center"` (logo centred, menu below).
- The menu lives in `site.json` (`nav`), so a future Gallery sub-menu is easy to add, but it is not built yet.
- Gallery spacing/row height: `layoutFor()` in `src/composables/justify.ts`.

## Deploying

`npm run build` produces `dist/`: plain static files that can go on any static host.

- **GitHub Pages**: publish `dist/`. `public/CNAME` already contains `photography.richardmuscat.com`, and the build copies
  `index.html` to `404.html` so `/about` and `/contact` work when opened directly.
- **Netlify / Cloudflare Pages**: build command `npm run build`, output `dist`. `public/_redirects` handles the routes.

**Adding photos later without a code rebuild:** `public/photos` and `public/data` are copied as-is, never bundled.
On a host where you upload files yourself, just upload the new image files and the edited `photos.json`.
If your host builds from git (GitHub Actions, Netlify, Cloudflare), pushing the new files triggers a build that takes seconds.

## Project layout

```
public/data/photos.json   photo list (edit me)
public/data/site.json     page text (edit me)
public/photos/            processed images (large/ + thumb/)
photos-src/               your originals (git-ignored)
scripts/photos.mjs        photo processing script
src/composables/justify.ts    justified-rows layout (pure function)
src/composables/useData.ts    loads the two JSON files
src/components/               header, footer, gallery, lightbox
src/views/                    Gallery, About, Contact pages
```

## Known limitations / ideas

- Pages are rendered in the browser, so link previews (WhatsApp, LinkedIn) show the generic site title/description, not the
  individual photo. Pre-rendering or a small `og:image` could be added later.
- Not included yet: tag/series filters, EXIF details on each photo, a contact form, a browser-based back office (phase 2).
