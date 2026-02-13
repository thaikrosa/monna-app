# Monna App - Handover Document
> Generated: 2026-02-13
> Context: P2 Refinement v2 completed, ready for P3

## Current State

### Git Status
- **Branch:** `main`
- **Commits ahead of origin:** 26 (not pushed)
- **Build status:** PASSING
- **TypeScript:** No errors (`tsc --noEmit` passes)

### Recent Commits (P2)
```
2fca51b docs: update HANDOVER.md with P2 completion status
0c50809 fix: resolve empty interface lint errors in shadcn components
21953c2 refactor: replace hardcoded colors with design tokens (Group 9)
949fc52 feat: respect prefers-reduced-motion (Group 8)
a594103 refactor: add touch feedback to interactive elements (Group 7)
0a4c3d1 perf: evaluate and reduce framer-motion usage
2391c5e feat: add optimistic updates to shopping list
bc80668 refactor: isolate dashboard mock data
16e3af1 fix: replace all TypeScript any with proper types
6e8ed36 refactor: extract shared ContactFormFields component
2273b8f refactor: split Settings into focused sections
```

---

## P3 Tasks (From MONNA_CODE_REVIEW.md)

### [P3-1] Ativar Dark Mode
**Problem:** Structure ready (`next-themes` installed) but no toggle
**Impact:** Expected feature by users
**Effort:** Small
**Files:** Need to add toggle in Settings, theme is already configured

### [P3-2] Verify/Remove Unused Dependencies
**Candidates:**
- `react-resizable-panels` (^2.1.9) - verify if used
- `next-themes` (^0.3.0) - currently unused (no toggle)
- `recharts` (^2.15.4) - NOT USED, ~150KB - **REMOVE**
- `lovable-tagger` (devDep) - remove post-migration

**Effort:** Small

### [P3-3] Use Correct HTML Semantics
**Problem:** Lists as divs, sections as divs
**Files to check:**
- Home sections → use `<section>`
- Shopping list items → use `<ul>/<li>`
- Reminder list items → use `<ul>/<li>`
**Effort:** Medium

### [P3-4] Add Pull-to-Refresh
**Impact:** Expected mobile UX
**Pages:** ShoppingList, Reminders, Agenda
**Effort:** Medium

### [P3-5] Add Missing ARIA Labels
**Files:** BottomBar, list items
**Effort:** Small

### [P3-6] Add JSON-LD Structured Data
**For:** Organization, WebApplication, FAQ page
**Effort:** Small

### [P3-7] Consider H1 on Home Page
**Current:** No visible H1 on Home
**Effort:** Small

---

## What Was Completed

### P2 Refinement (9 Groups) ✅
1. Settings.tsx refactor (505→117 lines)
2. ContactFormFields extraction
3. Remove all `any` types
4. Isolate mock data
5. Optimistic updates
6. Evaluate framer-motion (kept)
7. Touch feedback mobile
8. prefers-reduced-motion
9. Remove hardcoded colors

### P1 Refactor (7 Groups) ✅
1. Profile.tsx refactor (1069→57 lines)
2. BemVinda.tsx refactor (533→78 lines)
3. Error states
4. useEffect dependencies
5. SessionContext setTimeout hack
6. useHomeDashboard Promise.allSettled
7. Shared ChildFormFields

---

## Bundle Analysis

| Chunk | Size (gzip) |
|-------|-------------|
| index (main) | 215.24 KB |
| Reminders | 53.73 KB |
| Profile | 13.12 KB |
| Settings | 7.73 KB |
| Home | 6.72 KB |

**Potential savings from P3:**
- Remove `recharts` → ~150KB raw, ~50KB gzip savings

---

## Key Files for P3

### For Dark Mode Toggle
- `src/pages/Settings.tsx` - Add toggle here
- `src/components/settings/AboutSection.tsx` - Or here
- `src/index.css` - Theme variables already defined for `.dark`
- Check: `next-themes` ThemeProvider setup

### For Dependency Cleanup
- `package.json` - Remove unused deps
- Run: `npm uninstall recharts react-resizable-panels lovable-tagger`
- Verify no imports break

### For Semantic HTML
- `src/pages/Home.tsx` - Sections
- `src/pages/ShoppingList.tsx` - List items
- `src/pages/Reminders.tsx` - List items

### For Pull-to-Refresh
- Consider: `react-pull-to-refresh` or custom implementation
- Pages: ShoppingList, Reminders, Agenda

---

## Commands Reference

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# TypeScript check
npx tsc --noEmit

# Check for unused deps
npx depcheck

# Push commits (when ready)
git push
```

---

## Notes

- Backend NOT touched (per rules)
- All changes maintain identical visual behavior
- Build passes after each commit
- 26 commits ready to push when approved
- App.css is dead code (legacy Vite template, not imported)
