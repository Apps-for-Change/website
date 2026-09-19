# TODO - Website

## Completed

- [x] Migrate apps from old website with icons to new site
- [x] Host images/icons locally instead of linking to old WordPress
- [x] About, Get Involved, Support, and Privacy pages
- [x] Site URL in `astro.config.mjs` is `https://appsforchange.org`
- [x] Navbar brand link returns to home
- [x] Privacy policy rewritten per app (on-device vs cloud vs optional AI)
- [x] Beat the Craving counter copy: increments on coping choice, not app open

## Remaining

- [ ] Point DNS for appsforchange.org at Vercel (custom domain)
- [ ] Real EIN in `PUBLIC_NONPROFIT_EIN` (or keep omitted until confirmed)
- [ ] Enable donations (`STRIPE_SECRET_KEY` or `PUBLIC_STRIPE_DONATE_URL`)
- [ ] 1200×630 OG image and a valid Google Play badge
- [ ] Compress `public/images/afc-logo.png` and `bluesky-logo.png`
- [ ] Add App Store / Play URLs in `src/data/apps.json` when listings go live
- [ ] Restore reviews in `src/data/reviews.json` after stores exist
- [ ] Inventory leftover WordPress pages for redirects
