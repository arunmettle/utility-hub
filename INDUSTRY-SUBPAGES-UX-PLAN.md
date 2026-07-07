# Industry Subpages UX Plan

Last updated: 2026-07-07

## Problem

UtilityHub currently has industry collections, but the main product experience is still global and category-driven.

That creates three UX problems:

1. Industry users still enter a developer-first shell.
2. The left sidebar emphasizes generic tool categories instead of role-native workflows.
3. Collections behave more like editorial guides than dedicated workspaces.

For mechanical, civil, electrical, mining, and medical users, this weakens trust and creates intimidation. The first screen does not say “this is for me.”

## Current-state findings

## Navigation findings

- [src/components/AppShell.tsx](C:/Dev/Utility/utility-hub/src/components/AppShell.tsx) uses one global sidebar for every user.
- The sidebar organizes tools by generic categories such as `Formatters`, `Converters`, `Security`, and `Developer`.
- The sidebar brand copy is still explicitly tech-weighted: “Minimal browser-side utilities for developers, reviewers, and platform teams”.
- `Collections` are discoverable, but they are secondary entry points inside a general shell, not first-class modes.

## Collection UX findings

- [src/pages/CollectionPage.tsx](C:/Dev/Utility/utility-hub/src/pages/CollectionPage.tsx) is strong as a guide page.
- It is not yet a dedicated industry workspace.
- Collection pages explain the toolkit well, but they do not switch the app into an industry-specific navigation context.

## Home/findability findings

- [src/pages/Home.tsx](C:/Dev/Utility/utility-hub/src/pages/Home.tsx) already signals industry audiences better than before.
- The problem is not discoverability alone.
- The problem is that after click-through, the shell still behaves like one universal utility app.

## UX principle

Collections should evolve from:

- “role-based articles that link to tools”

into:

- “industry-specific modes with their own navigation, copy, and tool priorities”

## Recommended information architecture

## Level 1: Keep the global product

Keep the current global app because it still matters for:

- search-driven entry
- general-purpose users
- SEO breadth
- direct tool links

## Level 2: Add industry workspaces

Create dedicated routes such as:

- `/industries/mechanical`
- `/industries/civil`
- `/industries/electrical`
- `/industries/medical`
- `/industries/mining`

Each route should feel like a focused product area, not a filtered article.

## Level 3: Add industry-scoped tool routes

Recommended pattern:

- `/industries/mechanical/tools/tolerance-stackup-analyzer`
- `/industries/mechanical/tools/hole-shaft-fit-calculator`
- `/industries/mechanical/tools/bom-diff-checker`

Benefits:

- The user stays inside a mechanical context while navigating.
- The sidebar can stay mechanical-only.
- The shell copy, quick links, and related tools stay relevant.

Global tool routes should still exist for direct linking and SEO.

## Recommended UX behavior

## Industry landing page

Each industry landing page should include:

- a strong headline in that industry’s language
- a short “what this workspace is for”
- the top 3 to 6 tools only
- a workflow-first grouping, not category grouping
- industry pain points and trust framing

## Industry sidebar

When the user is inside an industry workspace:

- replace generic categories with industry-native sections
- keep the list intentionally small
- show only the relevant tools for that industry

### Example: mechanical sidebar

- `Dimensional checks`
- `Revision review`
- `Recurring calculations`
- `Formula lookup`

Mapped tools:

- `Tolerance Stack-Up Analyzer`
- `Hole/Shaft Fit Calculator`
- `BOM Diff Checker`
- `Drawing Revision Diff Checker`
- `Pressure Drop & Head Loss Calculator`
- `Mechanical Formula Finder`

### Example: civil sidebar

- `Revision review`
- `Hydraulic checks`
- `Field handover`

### Example: medical sidebar

- `Shift handover`

This matters because users should not see irrelevant tool vocabulary while they are in an industry mode.

## Tool pages inside an industry mode

Industry-scoped tool pages should show:

- industry breadcrumb
- industry-relevant quick links
- related tools from the same industry only
- copy tuned to that audience

The main tool logic can stay shared. The shell and surrounding experience should change.

## Recommended implementation shape

## Phase 1: Workspace shell mode

Add an industry-aware shell mode that changes:

- sidebar tool list
- sidebar heading
- brand/supporting copy
- related links

This can be driven by route context.

## Phase 2: Industry landing pages

Build dedicated industry landing pages using the existing collection data as the seed.

These pages should not just reuse the current collection article layout.

## Phase 3: Industry tool routes

Support nested industry tool paths while reusing the same underlying tool components.

This gives:

- focused navigation
- better breadcrumbing
- better perceived product fit

## Phase 4: Industry-specific homepage entry

Promote industry workspaces earlier on the homepage and collections index once the shell experience exists.

## Mechanical-first recommendation

Mechanical should be the first industry workspace to ship because:

- it now has the deepest non-IT industry tool depth
- its tools form a coherent workflow
- it is the best test case for whether industry modes improve clarity and trust

## Mechanical workspace proposal

### Sidebar sections

- `Core tools`
- `Fit and tolerance`
- `Revision and release review`
- `Calculations and formula lookup`

### Hero language

- “Mechanical browser tools for tolerance, fits, BOM review, revision comparison, and recurring calculations.”

### First tools shown

1. `Tolerance Stack-Up Analyzer`
2. `Hole/Shaft Fit Calculator`
3. `BOM Diff Checker`
4. `Drawing Revision Diff Checker`
5. `Mechanical Formula Finder`
6. `Pressure Drop & Head Loss Calculator`

## Risks

- Too many industry shells too early could create maintenance sprawl.
- If we clone tool pages instead of sharing them, content drift will become expensive.
- Some industries do not yet have enough depth to justify a full workspace.

## Decision

Do not build all industry workspace shells at once.

Build:

1. `Mechanical`
2. `Civil`
3. `Medical`

Reason:

- Mechanical has enough tools to validate the pattern.
- Civil is a good second case with overlapping but different needs.
- Medical is the best test of a minimal and narrow workspace.

## Recommendation

Proceed with a `mechanical-first industry workspace` implementation before rolling the pattern out to the rest.

That is the highest-value next UX move because it solves the most obvious trust issue:

- the right tools exist
- but the product still does not look like it was built for those users

