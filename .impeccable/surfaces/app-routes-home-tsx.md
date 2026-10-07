---
version: 1
slug: "app-routes-home-tsx"
primary_target: "app/routes/home.tsx"
related_targets: []
---

# Home · plagastop.cl

Scope: Home (`/`) and the interior templates (service, industry, empresa, contacto, cotizar, landing) share one world. Mode: Persuade. This is a redesign: direction B ("Plano de control") was rejected by the user; its look is now anti-reference. Kept from it only the coverage section structure and the per-area contact directory structure.

Audience and job: B2B decision makers (operations, quality, facility, plant managers, ports, agro). Action: start the quote in the hero (installation type + need → /cotizar prefilled); secondary: call Área Comercial. No WhatsApp. Proof: since 1985, Res. SAG 2732/2021, SNS 36365/2013, PEC Degesch, first ISO 9001 of the sector in Chile (2006), coverage Ñuble to Los Lagos, and 40+ real field photos of Plagastop crews (ports, ships, silos, warehouses, gas measurement). Stats only with real data (40+ años, 4 regiones, 8 sectores, 1ª ISO del rubro). No testimonials or client logos (none exist).

User-pinned reference: adhuntltd.com — photo service cards, intense color bands, warm/approachable tone, its scroll animations and a cursor-following dot (without the idle pink zoom and without image shine). Palette pinned: black/graphite + logo lime. Hero photo pinned: empresa.JPEG (HQ building).

Build path: code-led (no image generation). Stack unchanged (React Router v8 prerender, CSS Modules + tokens).

## Direction contract

THESIS: A field-proven service company shown through its own crews and sites: real photographs of Plagastop technicians on ships, silos and warehouses carry the trust, wrapped in a warm, rounded, energetic service-site rhythm. Refuses both the cold technical diagram (rejected direction B) and stock imagery or fabricated proof.

OWN-WORLD: white and #F3F4F5 grounds alternating with full-width graphite (#1C1F22) and ink (#0A0B0B) bands; lime #CCE70B for pill CTAs, icon discs, check marks, counters and a highlighter mark behind key words (never lime text on white). Sora (headlines, 600–700) + Figtree (body). Pill buttons, 20–28px photo radii, circular photo insets, soft shadows only on lifted cards. Line icons (1.5 stroke) inside lime discs.

STORY: the visitor sees Plagastop's own headquarters and crews at work, recognizes their industry, trusts four decades and the SAG authorization, and starts a quote from the hero bar or calls the Área Comercial.

FIRST VIEWPORT: full-bleed photo of the Concepción HQ (building left, kept visible); ink scrim from the right; on the right: H1 in Sora white with a lime-marked phrase, one-line lead, lime pill "Solicitar cotización" + outline "Ver servicios"; a caption pill on the building ("Nuestra sede · Parque Industrial Ejército"). A white rounded quick-quote bar (installation + need + button) overlaps the hero's bottom edge. Signature interaction: lime cursor dot following the pointer (desktop, fine pointers only), plus staggered fade-up reveals and counting stats.

FORM: user-pinned reference world (adhuntltd.com service-site grammar) translated to B2B industry with Plagastop's palette and real photography; no concept roll (pinned direction beats the roll).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions

Office days, response time, certification validity, lead destination (VITE_FORM_ENDPOINT), analytics + consent, hosting, vector logo, Documentación phone number, real testimonials/case studies (section omitted until they exist).
