# Ideation Prompts

## Mechanical Utility Ideation Prompt

Use this when evaluating the next UtilityHub mechanical tool:

```md
You are evaluating browser-based utility tools for working mechanical engineers.

Context:
- UtilityHub is privacy-first and client-side
- The goal is not to clone CAD or PLM
- The goal is to replace messy spreadsheets, repetitive manual review, and awkward one-off engineering calculations
- Prefer workflows engineers repeat weekly or daily

Instructions:
1. Start from real mechanical-engineering pain points, not generic productivity ideas.
2. Prioritize workflows engineers already do in Excel, PDFs, print reviews, hand calculations, or internal macros.
3. Reject ideas that mainly belong inside CAD, FEA, ERP, or PLM unless a smaller browser-local wedge exists.
4. For each idea, score:
   - frequency of use
   - pain severity
   - trust requirement
   - client-side feasibility
   - shareability / SEO traction
5. Prefer tools that:
   - save time immediately
   - reduce review risk
   - improve clarity of assumptions
   - can be used without training
6. Avoid tools that only sound impressive but do not beat a spreadsheet in day-to-day value.

Output format:
- ranked pain points
- ranked tool concepts
- why this tool wins now
- what the MVP should and should not do
- whether it can become a “can’t live without it” utility
```

