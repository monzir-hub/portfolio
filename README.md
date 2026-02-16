# Portfolio (Web + AI)

Premium, single-page portfolio for showcasing Websites, AI Videos, and Projects. Built with vanilla HTML/CSS/JS and data-driven content via `data/portfolio.json`.

## Run locally
- Open `index.html` directly in a browser, or
- Serve the folder (recommended for fetch): `npx serve .` then visit the shown URL.

## Structure
- `index.html` ? main layout (Home, Work, About, CV, Contact)
- `css/style.css` ? theme, layout, animations
- `js/main.js` ? data loading, filtering, modal, form handling
- `data/portfolio.json` ? editable portfolio items (id, title, category, descriptions, tools, media, links, featured)
- `public/profile.jpg` ? profile photo placeholder
- `public/cv.pdf` ? CV placeholder
- `public/portfolio/*` ? gallery thumbnails/full media placeholders

## Editing portfolio items
1) Open `data/portfolio.json`.
2) Each item fields:
   - `category`: `websites` | `ai-videos` | `projects`
   - `media.type`: `image` | `video` | `gallery`
   - `media.src` (for image/gallery) or `media.embedUrl` (for YouTube/Vimeo)
   - `links.live/github/caseStudy` are optional.
3) Add or remove items; set `featured: true` to surface at the top.

## Replace assets
- Profile photo: replace `public/profile.jpg` with your own image (keep filename or update paths in HTML).
- CV: replace `public/cv.pdf`. The hero buttons use the same path for download + open.
- Thumbnails/full media: drop files in `public/portfolio/` and update paths in `data/portfolio.json`.

## Deploy
- Any static host works (Vercel/Netlify/GitHub Pages). Publish the folder root.
- Ensure `data/portfolio.json` is served with correct MIME (default on most hosts).

## Contact form
- Currently posts to a demo Formspree endpoint. Replace the URL in `js/main.js` with your Formspree form URL (or custom backend). Front-end validation + honeypot included.

## Customization ideas
- Tweak colors and gradients in `:root` inside `css/style.css`.
- Update hero chips/services/about copy in `index.html`.
- Add testimonials or blog blocks by duplicating existing section patterns.

# portfolio
