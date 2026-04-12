# TODO - Website Migration

## Completed

- [x] Migrate apps from old website with icons to new site
  - Replaced 3 placeholder apps with real apps: Goal Getter, Care About You, Advocate's Compass, Beat the Craving
  - Downloaded all app icons locally to `/public/images/`
- [x] Add app store reviews to the new website
  - Added 2 reviews from old site to `reviews.json`
  - ReviewCarousel component already supports displaying them
- [x] Download and host all images/icons locally instead of linking to old website
  - App icons, logos, store badges, and fonts all downloaded to `/public/`
  - Updated all components: Hero, Navbar, BaseLayout, AppCard, ReviewCard, global.css
  - No more external `i0.wp.com` or `fonts.wp.com` references in source
- [x] Remove old donation links throughout the site
  - Removed WordPress membership fallback links (`appsforchange.org/?membershipId=2028`)
  - Donation now only shows when Stripe is configured or a Stripe link is set
- [x] Update site URL in astro.config.mjs to `appsforchange.org`
- [x] Replace old website navigation links in Footer with local anchors
- [x] Replace old website contact link in WhatWeDo with mailto

## Manual / Remaining

- [ ] Bring the domain over from old website
  - Site URL updated in config to `https://appsforchange.org`
  - DNS needs to be pointed from old WordPress host to Vercel
  - Add custom domain in Vercel dashboard: Settings > Domains > Add `appsforchange.org`
- [ ] Review other pages from old website for content to migrate
  - **About** page (`/about/`) - mission, history, org structure, tech approach
  - **Get Involved** page (`/get-involved/`) - volunteer roles, town halls, signup
  - **Contact** page (`/contact/`) - form, email, address, hours
  - These pages exist on old WordPress site but not yet on new site
  - Decide which to create as new Astro pages vs. just linking to email/socials
