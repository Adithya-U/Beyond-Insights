# Beyond Insights — Design System

## Direction

An editorial, technically grounded identity: warm paper, the exact deep navy sampled from the square logo, crisp data-blue, and a precise amber accent. The interface should feel like a considered advisory practice, not a software dashboard. The brand's network-and-horizon motif is used as a meaningful visual language for data moving toward clarity.

## Principles

- Lead with the business question and explain capabilities in plain language.
- Use original diagrams and typography instead of generic stock photography or decorative AI imagery. Keep visualizations open on the page canvas rather than framed like a media player or dashboard.
- Give each section a distinct role: introduce, explain the transformation, present services, describe the working approach, and invite a conversation.
- Do not publish invented client names, outcomes, testimonials, or statistics.
- Keep content editable through structured Pages CMS fields while layouts and motion remain authored in Astro.

## Color

| Token | Value | Use |
| --- | --- | --- |
| Ink Navy | `#00102E` | Header, footer, story diagram, high-contrast text; matches the square logo background |
| Paper | `#F5F2EA` | Main canvas |
| White | `#FFFFFF` | Diagram surfaces and content contrast |
| Signal Amber | `#F6AA13` | Primary action and meaningful emphasis |
| Data Cyan | `#10B9D2` | Connection and data-flow cues |
| Muted Ink | `#667080` | Secondary text on light surfaces |
| Hairline | `#D8D5CC` | Borders and separators |

## Typography

- Display: Bahnschrift with Segoe UI and Arial fallbacks. Use a consistent, confident sans-serif voice for headings.
- Interface and body: Segoe UI / Arial system stack for speed and consistent rendering.
- Section eyebrows: one shared sans-serif style and size throughout. Keep monospaced labels inside diagrams and data details.
- Body copy: comfortable 1.55–1.7 line height, with a readable measure.

## Spacing and layout

- Use a centered content width of approximately 1,220px with fluid side gutters.
- Use a shared section spacing token of 88–120px on desktop and 64px on mobile, with a consistent eyebrow-to-heading gap.
- Corners stay square or subtly rounded; avoid pill-shaped cards and excessive floating panels.
- At mobile widths, collapse columns into a single editorial flow and remove sticky pinning.

## Motion

- Scroll motion supports the page's story of connecting information and moving toward informed action. Keep it visually integrated with the surrounding content and avoid presenting it as a standalone video-like panel.
- GSAP ScrollTrigger scrubs the transformation so it follows the visitor's actual scroll position and reverses naturally.
- Do not smooth or hijack native scrolling.
- Prefer SVG attributes, opacity, and transforms. Avoid layout-thrashing animation.
- Respect `prefers-reduced-motion`: show the final, connected insight state without scroll pinning or animated transitions.
- On narrow screens, keep the diagram in document flow and advance its state as each story step enters view.
