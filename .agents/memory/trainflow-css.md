---
name: TrainFlow CSS rules
description: Critical ordering rule for Google Fonts in Tailwind v4 CSS
---

In Tailwind v4 (the @tailwindcss/vite plugin), any `@import url(...)` MUST be the very first line(s) of index.css, placed BEFORE `@import "tailwindcss"` and ALL other statements.

If placed after, PostCSS fails silently — fonts don't load and the build may not error.

**Why:** PostCSS processes imports in order; placing URL imports after Tailwind directives violates the CSS cascade spec that PostCSS enforces.

**How to apply:** When adding Google Fonts, Material Symbols, or any external CSS font to index.css, ensure they are the FIRST lines of the file.
