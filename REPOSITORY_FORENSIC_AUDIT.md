# REPOSITORY FORENSIC AUDIT

Run once per repo, in Cursor with that repo open. Run it exactly 4 times, on:

1. threejsportfolio (live: mfredebel.vercel.app — this is the flagship, give it the most scrutiny)
2. harringtonandco (live: harringtonandco.vercel.app)
3. calabar-son-1 (live: calabarson.vercel.app)
4. task-master (live: task-master-sand-gamma.vercel.app)

Keep the output format identical across all 4 so they can be pasted into the MASTER PORTFOLIO + CAREER AUDIT and compared side by side.

Your job is a **concise, evidence-rich technical audit**. Do not fix, rewrite, or redesign anything. Do not make career recommendations. Inspect the actual code, not just package.json/README.

**Length discipline:** target 400–700 words, except threejsportfolio which can run longer given it's the flagship. If a section has nothing meaningful to report, write one line and move on — don't pad. Skip scoring any skill with zero surface area in this repo rather than writing "0 — not applicable."

## 1. Engineering audit
Assess only what's relevant to this repo:
- architecture and separation of concerns
- code quality/maintainability, TypeScript/language quality
- frontend engineering; backend/API engineering if present
- database design if present
- state/data flow
- error handling/validation
- performance, accessibility, security
- testing
- Git/CI/CD/DevOps
- documentation

## 2. Specialized technologies
For any notable technology actually used (Three.js is the obvious one for threejsportfolio; also flag anything else — motion libraries, Supabase, etc.): how it's used, depth of implementation, meaningful engineering decisions, weaknesses. Dependency presence ≠ skill — say so if that's what you find. For threejsportfolio specifically: is the Three.js work custom geometry/shaders/scene logic, or largely default examples lightly modified? This matters a lot for how the flagship gets positioned later.

## 3. Evidence of skill
Table, evidence-only rows (skip anything with zero surface area in this repo):

| Skill | Evidence | Level |
|---|---|---|

0 = none, 1 = exposure, 2 = basic, 3 = independent, 4 = strong, 5 = exceptional. Score only what the code supports.

Also list: strongest 5 technical signals, weakest 5 technical signals, skills that appear superficial vs. genuinely demonstrated, important missing practices.

## 4. Interview defensibility
The most important technical/architectural decisions I should be able to explain, plus likely interview questions. Flag anything that looks more sophisticated than the surrounding code — that's a place AI likely did more of the thinking than I did, and I need to actually understand it before presenting it.

## 5. Portfolio evidence
Do NOT decide whether to keep the project — that's already settled. State what it technically demonstrates: frontend / backend / full-stack / UI implementation / architecture / testing / DevOps / AI / creative development / performance / other.

## 6. Uncertainty
Separate: observed from code / inferred / requires runtime or visual testing (note: since this repo has a live URL, prefer "observed live" over "inferred" wherever you can actually check the deployed site). Never invent performance numbers, security vulnerabilities, or capabilities.

## FINAL FORMAT

# Repository Audit
**Name:** · **Live URL:** · **Purpose:** · **Stack:** · **Maturity:**

### Engineering Quality
### Specialized Technology
### Performance / Accessibility / Security
### Testing / DevOps
### Documentation

### Skill Scorecard
(table)

### Top 5 Strengths
### Top 5 Weaknesses
### Superficial vs Demonstrated Skills
### Interview Risks
### Portfolio-Relevant Technical Evidence
### Uncertainties

Be direct. Prioritize meaningful findings over exhaustive commentary. Do not waste tokens describing trivial files.
