# IGCSE Tutorial — Repo Transfer Bundle

This folder holds every planning/spec doc worth moving from the Claude project into the `igcse-quiz` repo before continuing in Claude Code. The layout mirrors the repo paths **as referenced by `CLAUDE.md`**. Per `CLAUDE.md`'s own rule, *the filename is authoritative* — if a doc already lives at a slightly different path in your repo, keep the repo's location and treat these as the content of record.

Nothing here is code — these are the markdown docs. Your `src/`, `dist/`, `tools/`, `index.html`, tests, etc. are already in the repo and are not reproduced.

## What's in here

**Root (siblings of `CLAUDE.md`)**
- `CLAUDE.md` — the design contract, house style, build workflow, and planning index. The template every course folder copies.
- `blueprint-architecture.md` — cross-subject recognition library; the canonical catalogues (tutor/build-facing).
- `foundations-diagnostic-layer.md` — engine-level diagnostics (warm-ups, secret passages, weather map).
- `master-roadmap.md` — cross-subject exam plan (staggered sittings, readiness gates).
- `persistence-layer-plan.md` — **the next build task's executable spec.** Read this + `CLAUDE.md` to build the persistence layer.
- `session-handoff.md` — the "start here" pickup note; carries the base-branch warning and settled decisions.
- `catalogue-amendments-adjudicated.md` — **maths** audit, adjudicated + applied.
- `blueprint-coverage-audit-v1.md` — earlier *sampled* hand-audit (superseded by the full audit, kept for provenance).

**`claude/`** (matches `CLAUDE.md`'s explicit `claude/…` references)
- `catalogue-amendments-cs-adjudicated.md` — **CS** audit, adjudicated + applied.
- `catalogue-amendments-english-adjudicated.md` — **English** audit, adjudicated + applied.

**`computer-science/`**
- `secret-language-course-plan.md` — CS 0478, 36 modules.
- `the-bridge-phase-2-plan.md` — exam-prep architecture (applies to every course).

**`maths/`**
- `the-rebuilder-maths-course-plan.md` — Maths 0580 Core, 52 modules.

**`english/`**
- `the-first-reader-english-course-plan.md` — English 0500, 29 modules.
- `writing-feedback-tool-spec.md` — the Claude-powered reading companion spec.

## Immediate next task (per the handoff)

Build the **persistence layer** in Claude Code: read `CLAUDE.md` → `persistence-layer-plan.md`, confirm the base branch first (origin `main` is behind your local copy), then execute the spec's sections 1–7.

## On the duplicate filenames in the project

The Claude project's flat view showed three filenames twice: `catalogue-amendments.md`, `catalogue-amendments-adjudicated.md`, and `question-audit.json`. These are **not per-subject splits** — they're timestamped versions of the same interim/raw artifacts from different Cowork sessions. The real per-subject audit outputs are the three suffixed adjudicated docs included here (`-adjudicated.md` for maths, `-cs-adjudicated.md`, `-english-adjudicated.md`).

## Deliberately NOT included (interim/raw — the adjudicated docs above supersede them)

- `question-audit.json` — raw audit evidence (~6,641 rows). Large; only needed if you want to re-derive the adjudications. Still lives in the project.
- `catalogue-amendments.md` — interim provenance before adjudication.

If you want either of these pulled in too, say so and I'll add them.

## A path note to double-check

The root-vs-`claude/` split for `master-roadmap.md`, `session-handoff.md`, and `persistence-layer-plan.md` is a judgement call: the docs' own text calls them siblings of `CLAUDE.md` (root), while the project namespaces them under `claude/`. I placed them at root to match the docs' text. The CS and English adjudicated docs are under `claude/` because `CLAUDE.md` references them there explicitly. Move any of these to wherever your repo already keeps them — filename is what's authoritative.
