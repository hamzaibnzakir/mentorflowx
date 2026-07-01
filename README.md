# MentorFlowX — Landing Page

A single, static landing page (no build step) — ready to push to GitHub Pages.

## Files
```
index.html
style.css
script.js
assets/
  videos/        ← put your 4 testimonial .mp4 files + poster images here
  screenshots/   ← put your 10 proof screenshots here
```

## 1. Add your videos
Drop your 4 files into `assets/videos/` named exactly:
```
testimonial-1.mp4   testimonial-1-poster.jpg
testimonial-2.mp4   testimonial-2-poster.jpg
testimonial-3.mp4   testimonial-3-poster.jpg
testimonial-4.mp4   testimonial-4-poster.jpg
```
The poster image is the thumbnail shown before someone hits play — grab any clean frame from the video (e.g. Descript, or a screenshot at the best-looking second).

**About "playable but not downloadable":** the page already disables the browser's download button, right-click save, and picture-in-picture (`controlsList="nodownload"`, `oncontextmenu="return false"`, `disablePictureInPicture`). Be aware there's no way to make a video 100% undownloadable in a browser — a determined person can always grab it via dev tools. This stops the casual "right click → save video" path, which is what matters for 99% of visitors. If you want it locked down harder, host on Vimeo/YouTube unlisted with their download-block settings and embed that instead — happy to wire that up if you'd rather go that route.

## 2. Add your screenshots
Drop 10 images into `assets/screenshots/` named:
```
proof-1.jpg ... proof-10.jpg
```
(jpg or png both work — just keep the filenames matching). If a file is missing, that card automatically shows a "drop your screenshot here" placeholder instead of breaking, so you can launch before every screenshot is ready and swap them in later.

Edit the `shotLabels` array near the top of `script.js` to change the caption under each card (e.g. "Payout received", "Ad ROAS screenshot").

## 3. Update placeholders before launch
Search these in the files and swap with your real info:
- `https://wa.me/10000000000` → your real WhatsApp number in international format, no `+` or spaces (e.g. `https://wa.me/2348012345678`). Appears in 3 places: nav, apply section, floating button, footer.
- Trust ticker stats in `index.html` (`.ticker-item` values) — currently placeholder numbers like "500+ students mentored".
- Hero glass card numbers (`data-count="41"`, `data-count="6"`) and spot-pill count in the urgency section — update to reflect real cohort numbers.
- Video testimonial names/taglines (`.proof-name`, `.proof-tagline`).

## 4. Formspree
Already wired to `https://formspree.io/f/mdarwgwg`. The form submits via fetch so it can show an inline "Application received" success state instead of redirecting to Formspree's default page. No further setup needed unless you want to add spam filtering or notification rules — that's configured on formspree.io directly.

## 5. Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial MentorFlowX landing page"
git branch -M main
git remote add origin https://github.com/hamzaibnzakir/YOUR-REPO-NAME.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source → Deploy from branch → main → / (root)**. Your site will be live at `https://hamzaibnzakir.github.io/YOUR-REPO-NAME/`.

For a custom domain, add a `CNAME` file to the repo root containing just your domain, and point your DNS `A`/`CNAME` records at GitHub Pages per their docs.

## Notes on the design
- Dark navy background, blue→violet gradient for trust/action elements, gold reserved only for urgency/scarcity (spots remaining, urgency badge) — so the two accent colors never compete for attention.
- Testimonial and screenshot cards use a "verified proof" visual language (mono metadata, green ✓ verified tag) to reinforce trust without extra sales copy.
- 3D tilt only activates on devices with a mouse (`hover: hover` + `pointer: fine`) — disabled on touch devices so it doesn't fight with scrolling.
- No pricing section, as requested — the "How it works" section and apply-form reassurance list carry that message instead ("pricing tailored once accepted").
