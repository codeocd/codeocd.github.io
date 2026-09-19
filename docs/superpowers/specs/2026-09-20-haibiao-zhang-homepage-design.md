# Haibiao Zhang Bilingual Academic Homepage Design

## Status

Approved in conversation on 2026-09-20. This document defines the implementation scope for adapting the existing academic-homepage template and publishing it at https://codeocd.github.io.

## Goal

Build a polished bilingual academic homepage for Haibiao Zhang / 张海彪 from the supplied Chinese CV and user-confirmed materials. English is the first-visit default, and every visible page section can switch to Chinese without navigation or reload. The site must contain only Haibiao Zhang's content and must not expose the template author's previous homepage, CVs, media, or archived pages.

## Public Identity

- English name: Haibiao Zhang
- Chinese name: 张海彪
- Browser title and site brand: Haibiao Zhang only
- Role: Ph.D. Candidate in Computer Technology at the University of Science and Technology of China
- Public location: Hefei, China / 中国合肥
- Public email: haibiaozhang@mail.ustc.edu.cn
- GitHub profile: https://github.com/codeocd
- Google Scholar: https://scholar.google.com/citations?user=_liHsuEAAAAJ&hl=zh-CN
- Supervisor: Researcher Xiaojie Wang / 王晓洁研究员, linked to http://www.ipp.cas.cn/bm/wb/rcdw/dsjj/202009/t20200907_365792.html
- Research institution: Institute of Plasma Physics, Chinese Academy of Sciences / 中国科学院等离子体物理研究所

The site must not publish the phone number, street address, CV download, ORCID, ResearchGate, DBLP, or other unconfirmed accounts. It must not name the CRAFT experimental platform.

## Information Architecture

The site remains a single-page academic profile with the following order.

1. Profile: portrait, name, role, affiliation, research focus, location, email, GitHub, Google Scholar, and WeChat. WeChat opens a modal containing the complete supplied image, including its nickname and location.
2. About and Research Interests: concise research positioning, the linked supervisor name, and the public research institution.
3. News: dated publication highlights and the TWCS review status.
4. Experience and Education: education, research projects, internship, experimental-operation experience, and volunteer service. Use official USTC, Southwest Forestry University, and Institute of Plasma Physics marks. Remove the 22,000+ dataset size and the approximately 50% simulation-cost reduction. Describe experimental operation without naming CRAFT.
5. Selected Publications: Data-driven fault diagnosis method for abnormal RF oscillation of gyrotrons as the first-author selected publication.
6. Collaborative Work: the robust fault-prediction paper, ECRH launcher paper, and CFEDR paper. Highlight Haibiao Zhang's name in each author list.
7. Ongoing Research: TWCS appears separately and is explicitly labeled AAAI 2027 · Under Review / AAAI 2027 · 在审. It is not counted as accepted or published.
8. Open Source: show only https://github.com/zhang-haichao/senpai-skill and state Haibiao Zhang's role as Core Contributor / 核心贡献者 without implying repository ownership.
9. Intellectual Property: two granted invention patents and two software copyrights. Show title, number, date, and right holder only. Do not render complete inventor or author lists in text.
10. Skills and Awards: use the supplied CV as the source and do not add unverified claims.

## Publication and Research Media

All supplied images are copied into the repository and served locally. Temporary clipboard paths and external image hosts must never be runtime dependencies. Preserve complete figures, legends, labels, and axes; contain images rather than crop scientific content. Each image opens in an accessible modal with a title, close control, backdrop dismissal, and Escape-key dismissal.

- Selected publication: Data-Driven Gyrotron RF Oscillation Fault Diagnosis Framework..jpg
- Robust fault prediction: supplied GMM, contrastive-learning, and feature-extractor framework PNG
- ECRH launcher: supplied steering-mechanism schematic PNG
- CFEDR ECCD: use the replacement six-panel 190/210/230 GHz co- and counter-ECCD PNG; do not publish the earlier contour-image submission
- TWCS: supplied simulation-bottleneck and decision-oriented-design framework PNG

The site displays no fabricated paper figure, code link, preprint link, citation count, or publication status. Google Scholar remains a profile link only; weekly Scholar synchronization is disabled and publication metadata is maintained manually.

## Portrait and Contact Media

- Use D:/OneDrive/桌面/photo.jpg as the portrait source.
- Generate a web-optimized copy centered on the face and upper body while preserving the source file unchanged.
- Use the complete supplied WeChat image in the modal, including 小张同学 and 安徽 合肥, as explicitly approved.
- The WeChat image is not shown until the visitor activates the WeChat control.

## Intellectual Property Media and Privacy

Create public copies of all four supplied certificate images. Keep the certificate title, registration or patent number, dates, right holder, QR code, and barcode visible. Obscure complete inventor/author name lists and detailed street addresses in the raster files before they enter the public directory.

Public metadata derived from the certificates:

- CN 120029768 B: granted 2026-03-10; patent holder is the Hefei Institutes of Physical Science, Chinese Academy of Sciences.
- CN 121619724 B: granted 2026-03-31; patent holder is the Hefei Institutes of Physical Science, Chinese Academy of Sciences.
- 2025SR1824848: registered 2025-09-19; software copyright holder is the Hefei Institutes of Physical Science, Chinese Academy of Sciences.
- 2020SR0059618: completed and first published 2019-11-26; registered 2020-01-13.

Because retained QR codes may expose additional official registry information, the visible modal should make no stronger privacy promise than the applied image redactions.

## Visual Direction

Retain the template's restrained editorial-academic character instead of turning the site into a dashboard or a grid of decorative cards. The first viewport reads as one composition with a compact profile column and a readable main narrative column. White and soft-neutral surfaces, dark text, and limited blue/green accents provide contrast without overwhelming the research imagery.

- The portrait is the primary personal visual.
- Institution marks support timeline entries and remain visually subordinate.
- Scientific figures are shown at their natural aspect ratios with clear enlargement affordances.
- Certificate thumbnails use a consistent portrait ratio and open to readable public copies.
- Motion is limited to purposeful section reveal, navigation feedback, and modal transitions.
- Reduced-motion preferences disable nonessential motion.
- Desktop and mobile layouts must avoid horizontal overflow, clipped controls, and overlapping text.

## Language and Interaction

- First visit defaults to English.
- The upper-right EN / 中文 control switches all visible page content in place.
- The selected language persists in local storage for later visits.
- The visible name changes to 张海彪 in Chinese mode while the document title remains Haibiao Zhang.
- Mobile navigation remains compact and keyboard accessible.
- All external links open safely, and every meaningful image has localized alternative text.
- Modals trap focus while open, restore focus to their trigger on close, support Escape, and prevent background scrolling.

## Content and Asset Boundaries

- Remove the public CV download control and both CV PDFs from deployable output.
- Remove the template author's legacy site, CVs, portraits, figures, certificates, and archived public routes from the repository used for deployment.
- Do not render initials, stock photos, borrowed figures, or other placeholders when a confirmed asset is unavailable.
- Download and document official institution-logo sources; serve archived local copies rather than hotlinking.
- Do not enable Scholar citation counts or scheduled metadata synchronization.

## Architecture

Continue using the existing Astro static-site structure. Localized content and verified links remain in typed data modules. Publication metadata remains a manually reviewed local dataset. Public images live under purpose-specific directories for profile, publications, institutions, intellectual property, and contact media.

Reusable modal behavior serves publication figures, certificates, and WeChat while allowing content-specific labels and dimensions. Follow existing Astro patterns and do not add a client framework solely for modal state.

## Deployment

- Production repository: codeocd/codeocd.github.io, created as a public repository.
- Production URL: https://codeocd.github.io.
- GitHub Pages deploys the Astro production build through GitHub Actions.
- The deployment workflow runs the complete local validation gate before uploading the Pages artifact.
- Creating the repository and pushing use the user's existing authenticated GitHub session; no password or token is requested in chat.

## Verification

The implementation is complete only after all applicable checks pass and the deployed page is reachable.

- Content tests cover verified links, publication grouping, review status, disabled Scholar synchronization, and the absence of CV links.
- Privacy tests scan source and built output for the phone number, street address, CRAFT name, hidden quantitative claims, complete certificate name lists, template-author identity, and legacy routes.
- Asset tests confirm every public image exists locally and no source points to a temporary filesystem path.
- Astro type checking and a production build complete successfully.
- Playwright covers default English, Chinese switching and persistence, desktop and mobile navigation, WeChat modal, scientific-figure modal, certificate modal, keyboard closure and focus restoration, reduced motion, and horizontal overflow.
- Desktop and mobile screenshots are reviewed for cropping, readability, overlap, and visual hierarchy.
- After deployment, verify the production URL, canonical metadata, key external links, and representative media interactions.

## Acceptance Criteria

1. https://codeocd.github.io presents only Haibiao Zhang's bilingual academic profile.
2. English is the first-visit default and every section switches cleanly to Chinese.
3. The confirmed portrait, five research figures, four privacy-processed certificates, official institution marks, and complete WeChat image render correctly from local assets.
4. Publications are split into one selected first-author item, three collaborative items, and one separately labeled under-review project.
5. The site exposes no phone number, detailed address, downloadable CV, CRAFT name, excluded quantitative claims, complete certificate contributor lists, template-owner content, or automated Scholar citation data.
6. GitHub, Scholar, supervisor, DOI, open-source, email, and WeChat interactions work on desktop and mobile.
7. The full test gate and post-deployment checks pass before the work is reported complete.
