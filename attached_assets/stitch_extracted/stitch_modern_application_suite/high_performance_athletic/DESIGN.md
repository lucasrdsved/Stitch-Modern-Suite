---
name: TRAINFLOW High-Intensity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c5c9ae'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8f937b'
  outline-variant: '#444934'
  surface-tint: '#aed50d'
  primary: '#ffffff'
  on-primary: '#293500'
  primary-container: '#c9f236'
  on-primary-container: '#576c00'
  inverse-primary: '#526600'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#0e3446'
  tertiary-container: '#c4e7ff'
  on-tertiary-container: '#47687d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9f236'
  primary-fixed-dim: '#aed50d'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3d4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#a9cbe2'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#284b5e'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  electric-lime: '#C9F236'
  surface-glass: rgba(26, 26, 26, 0.4)
  status-warning: '#FFB800'
  border-subtle: '#333333'
  pure-black: '#000000'
typography:
  display-giant:
    fontFamily: Bebas Neue
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 110px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1.5rem
  gutter: 1rem
  stack-gap-lg: 2rem
  button-height-standard: 3.5rem
  button-height-heavy: 5rem
  touch-target-min: 2.75rem
---

## Brand & Style
The brand is aggressive, high-energy, and technical, designed for elite fitness performance. It targets "power-users" of the gym who value data-driven progress and raw intensity. 

The design style is a hybrid of **High-Contrast Bold** and **Glassmorphism**. It utilizes a pure black foundation to eliminate distractions, punctuated by "electric" lime accents that signal action and energy. Translucent glass panels provide a layer of sophisticated depth without breaking the focused, dark environment. The overall emotional response should be one of "flow state"—monumental, gritty, and clinical.

## Colors
The palette is dominated by **Pure Black (#000000)** to maximize OLED efficiency and visual focus. The functional core is built around **Electric Lime (#C9F236)**, used exclusively for primary actions, progress indicators, and active states. 

- **Primary:** Electric Lime for high-visibility metrics and "Go" actions.
- **Secondary:** Off-white/Silver (#E5E2E1) for high-readability body text and icons.
- **Neutral:** Deep greys and pure blacks for layering.
- **Semantic:** Gold/Warning (#FFB800) is reserved for personal records (PRs) and critical low-timer warnings.

## Typography
The system uses a high-contrast typographic pairing: **Bebas Neue** for all display and headline roles to evoke a cinematic, athletic feel, and **Inter** for all functional, body, and label text to ensure maximum legibility during intense physical activity.

**Key Rules:**
- Headlines must always be **Uppercase** with slight tracking increases for a premium "poster" look.
- Use `display-giant` for background watermarks or "big-number" countdowns.
- `label-sm` and `label-md` should use increased letter spacing (0.02em+) when used for metadata or uppercase sub-headers.

## Layout & Spacing
The layout follows a **Fluid Content Model** optimized for one-handed mobile use. It prioritizes a central "Focus Zone" (the timer) with supplementary metrics placed in a balanced grid below.

- **Grid:** A standard 2-column grid is used for metrics (`Weight`, `Reps`).
- **Margins:** 1.5rem (`container-margin`) provides a safe gutter for mobile grips.
- **Vertical Rhythm:** Large 2rem gaps (`stack-gap-lg`) separate major logical blocks (Header vs. Media vs. Controls).
- **Touch Targets:** Interactive elements adhere to a minimum of 44px (2.75rem), with primary workout buttons using an oversized 3.5rem - 5rem height for easy tapping during movement.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Light Emission** rather than traditional shadows.

- **Base Layer:** Pure Black (#000000).
- **Surface Layer:** Glass panels use a 40% opaque dark fill with a heavy 20px backdrop blur and a subtle 1px white border at 5% opacity.
- **Electric Glow:** The primary color (Lime) uses a `box-shadow: 0 0 25px rgba(201, 242, 54, 0.3)` to simulate neon light emission on active buttons or indicators.
- **Visual Stacking:** Higher priority items use higher transparency or brighter border-strokes to appear "closer" to the user.

## Shapes
The shape language is "Squircle-adjacent" with a focus on **Rounded (Level 2)** geometry.

- **Cards/Panels:** Use `rounded-xl` (1.5rem) for a modern, high-end feel.
- **Interactive Buttons:** Use `rounded-full` (Pill-shaped) for primary actions to distinguish them from informational cards.
- **Small Elements:** Use `rounded-lg` (1rem) for music album art and secondary metric containers.
- **Progress Bars:** Fully rounded (caps) to maintain the fluid, energetic aesthetic.

## Components
### Buttons
- **Primary Action:** Pill-shaped, Lime background, Black text, bold weight. Must include an `electric-glow` shadow.
- **Secondary/Icon Buttons:** Circular with a subtle 1px border. Background is transparent or semi-transparent glass.

### Progress Bars
- Background should be `surface-container-highest` (#353534).
- Fill must be the Primary Lime.
- Transitions must be smooth `cubic-bezier(0.4, 0, 0.2, 1)` to feel high-tech.

### Metric Cards
- Glass-panel background with a 4px left-accent border in Primary Lime to anchor the data.
- Labels are `label-sm` uppercase, while values use `display-lg` sizing.

### Media Player
- A "Floating Bar" implementation using the standard Glassmorphism treatment. 
- Integrated controls should use icons from a consistent set (Material Symbols Outlined).

### Navigation
- Bottom Bar: High-blur (30px+) glass background.
- Active State: Background pill highlight with `surface-variant/30` and Primary Lime icon/text.