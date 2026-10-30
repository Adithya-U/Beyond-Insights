# Beyond Insights website

Homepage prototype for Beyond Insights, built with Astro, Tailwind CSS, GSAP ScrollTrigger, and Pages CMS.

## Local development

```sh
npm install
npm run dev
```

Use Node.js 22.12 or newer.

The homepage is intentionally the first implementation pass. The scroll story connects scattered source nodes into an integrated data layer and then reveals an original insight chart. The service names and brand assets come from the project brief. Case studies, client logos, testimonials, and performance claims are omitted until the company supplies verified material.

## Content editing

Pages CMS is configured in `.pages.yml`. Homepage text and service descriptions are in `content/site/homepage.json`; the layout and animation remain in Astro source. Connect the repository to Pages CMS once it is hosted in GitHub. The contact email field is blank until the company provides the real destination.

## Before production

- Add the verified company contact email and real form destination.
- Confirm the approved headline and remaining copy.
- Add real case studies and team details when supplied.
- Set the canonical production URL in `astro.config.mjs` and connect Cloudflare Pages.
