# Haibiao Zhang Academic Homepage

## Goal

Build a polished, single-page academic homepage from the current English and Chinese CVs. English is the default language and all visible content can be switched to Chinese without leaving the page.

## Identity and research positioning

- Haibiao Zhang / 张海彪
- Ph.D. Candidate in Computer Technology, University of Science and Technology of China (USTC)
- Research focus: artificial intelligence for large engineering systems, gyrotron and ECRH systems, data-driven modeling, fault diagnosis and prediction, Transformer-based time-series analysis, and tolerance-aware design screening
- Advisor: Prof. Xiaojie Wang (shown as text until a public profile link is confirmed)

## Public contact and privacy

- Show the academic email `haibiaozhang@mail.ustc.edu.cn` and `Hefei, China`.
- Do not render the phone number or full street address.
- Do not render unverified social links, IDs, or an unconfirmed portrait.

## Page composition

1. Bilingual profile sidebar with an initials fallback when no portrait is supplied.
2. About and research themes.
3. News highlights based on dated publications and the clearly marked AAAI 2027 review status.
4. Education, research projects, experimental operation, internship, and volunteer timeline.
5. Publications with DOI links and author highlighting.
6. Ongoing Research with a public-safe summary of TWCS.
7. Intellectual Property with two granted patents and two software copyrights.
8. Skills, awards, and footer contact.

## Content and automation rules

- Published papers are maintained in `src/data/publications.json`.
- Under-review work is maintained separately in `src/data/site.ts` and visibly marked as under review.
- No paper figure, code link, citation count, patent date, inventorship, or social identity is fabricated when the CV does not provide it.
- Scholar automation is disabled while the profile ID is unverified. Supplying `SCHOLAR_ID` explicitly enables the safe updater.

## Visual direction

Retain the template's editorial academic layout, bilingual switch, responsive timeline, subtle reveal motion, accessible focus states, and no-overflow behavior. Use text-first publication and IP entries when no verified visual asset is available.

## Open decisions

- Verify the GitHub username and final public URL.
- Verify the Google Scholar ID or keep manual publication maintenance.
- Decide whether to publish a portrait, the TWCS under-review entry, advisor/institute details, and the old `public/legacy/` archive.
