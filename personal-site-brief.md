# Personal Website — Build Brief

> **For:** Claude Fable 5 (build partner)
> **From:** Andrew
> **How to use this brief:** Read it end-to-end, then *propose the site architecture and file structure before writing code*. Build in small, reviewable steps. I want to understand what we build, not just receive it — explain non-obvious choices as we go.

---

## 1. What this is

A personal website — my "home on the web." Not a résumé dump and not a pure portfolio. It should show the whole person: product manager by day, indie full-stack builder by night, plus real interests. **Balanced blend of personal and professional.**

Primary purpose: a personal presence I'm proud to point people to. Secondary: it quietly demonstrates that I can build (the site itself is the proof, so I don't need to say "I'm a developer").

## 2. About the subject (me) — *verify & expand*

- Product Manager at a ski company, based in the Salzburg / Eugendorf area, Austria.
- Independent full-stack builder. Comfortable stack: React/Tailwind, Node/Express or FastAPI, PostgreSQL.
- Currently in an active SaaS-ideation phase (EU regulatory-compliance tooling for the DACH SMB market).
- Interests to feature as concrete artifacts, not a hobby paragraph: Japanese cooking, cycling, gaming.
- *TODO: add a few sentences of real first-person voice for the landing intro.*

## 3. Aesthetic direction

Japanese minimalism, warm — think MUJI, not clinical white.

- **Palette:** bone / off-white base; muted earthy tones (clay, sage, stone); one restrained accent.
- **Space:** generous whitespace, calm rhythm, nothing crowded.
- **Type:** one clean, highly readable typeface; strong hierarchy through size/weight, not decoration.
- **Texture:** subtle film-grain / paper overlay to add warmth (static, not animated).
- **Feeling:** deliberate and quiet. Craft over flash.

## 4. Site structure

- **Landing** — short, honest first-person intro (3–4 real lines). One tasteful motion moment, then still.
- **Now** — a `/now` page: what I'm focused on this season. Low-maintenance, signals the site is alive.
- **Work** — occupational CV, skimmable.
- **Building** — projects with real case-study depth (start with *partmatch* + current SaaS experiments).
- **Off the clock** — cooking / cycling / gaming as concrete artifacts (dishes I make, current bikes, current games). Include at least one interactive element (see §6).

## 5. Tech stack

- **Framework:** Astro (content-first, islands architecture, ships minimal JS). React components as islands only where interactivity is needed. Content in MDX.
- **Styling:** Tailwind.
- **Page transitions:** native View Transitions API (Astro first-class support) for smooth, app-like navigation.
- **Hosting:** static deploy on Vercel / Netlify / Cloudflare Pages, GitHub push → deploy.

## 6. Motion & interaction

Use *few, slow, deliberate* moments. Two or three that read as craft — not motion everywhere.

- **Motion (formerly Framer Motion)** — default for enter/exit, layout, hover micro-interactions.
- **GSAP + ScrollTrigger** — for choreographed scroll sequences (now 100% free, incl. all plugins).
- **Lenis** — smooth scroll for a weighted, intentional feel.

Signature moments to build:
1. **SplitText hero reveal** — intro line animates in character-by-character with a gentle stagger, then settles.
2. **Time-of-day palette** — earthy background subtly shifts warm at dusk / cooler midday. Nearly invisible, memorable.
3. **Scroll-linked project cards** — rise and settle as you reach them; quiet hover lift.
4. **Interactive cooking element** — e.g. a real recipe with a servings slider in the "Off the clock" section.

## 7. Non-negotiables

- **Accessibility:** honor `prefers-reduced-motion` from the start; semantic HTML; keyboard-navigable; sufficient contrast.
- **Performance:** static-first, minimal JS, lazy-load images. It should feel instant.
- **No template feel:** avoid generic AI/starter-kit aesthetics. Design choices should feel intentional and specific to me.
- **Responsive:** great on mobile first, then scale up.

## 8. Content I'll provide

- Landing intro copy (first-person).
- CV details / roles / timeline.
- Project write-ups: partmatch + 1–2 SaaS experiments (problem, what I built, stack, outcome).
- Interests: a few dishes (incl. one full recipe), current bikes, current games.
- Any photos / assets.

## 9. How to work with me

1. Propose site architecture + file/folder structure. Wait for my sign-off.
2. Build a landing-hero prototype first (SplitText reveal, grain texture, reduced-motion handling) so I can feel the vibe.
3. Iterate section by section. Explain non-obvious decisions.

---

## 10. Inspiration / reference sites — *TO FILL IN*

> Add sites whose feel, layout, motion, or typography I want to borrow from. Be specific about *what* to take from each — it's far more useful than just a link.

| Site (URL) | What I like about it | What to borrow |
|---|---|---|
|https://lauren-waller.com| Design direction, elegant animations, use of differnt font sizes - starts big and gets more detailed|  |
|https://www.rammaheshwari.com| pretty boring, but safe |  |
|https://www.seanhalpin.xyz| clean  design , colors, night mode | interactive widgets |
|  |  |  |

**Notes / anti-references** *(sites or patterns to avoid, and why):*

-
-
