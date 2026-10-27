---
name: Informatics Student Union Portal
colors:
  surface: '#f7f9ff'
  surface-dim: '#bfddfd'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#d8eaff'
  surface-container-highest: '#cee5ff'
  on-surface: '#001d32'
  on-surface-variant: '#40484c'
  inverse-surface: '#13334b'
  inverse-on-surface: '#e8f2ff'
  outline: '#70787d'
  outline-variant: '#c0c8cd'
  surface-tint: '#25657d'
  primary: '#003b4d'
  on-primary: '#ffffff'
  primary-container: '#07536a'
  on-primary-container: '#8ac5e0'
  inverse-primary: '#94cfea'
  secondary: '#396280'
  on-secondary: '#ffffff'
  secondary-container: '#b3dcfe'
  on-secondary-container: '#38617f'
  tertiary: '#003c43'
  on-tertiary: '#ffffff'
  tertiary-container: '#00555e'
  on-tertiary-container: '#3ecfe1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bce9ff'
  primary-fixed-dim: '#94cfea'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d63'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#a2cbed'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#1f4b67'
  tertiary-fixed: '#93f1ff'
  tertiary-fixed-dim: '#4bd8ea'
  on-tertiary-fixed: '#001f23'
  on-tertiary-fixed-variant: '#004f57'
  background: '#f7f9ff'
  on-background: '#001d32'
  surface-variant: '#cee5ff'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  stat-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
  space-3xl: 6rem
---

## Brand & Style

The design system projects an ambitious, professional, and forward-looking academic identity tailored for HMIF (Himpunan Mahasiswa Informatika) UNIBA Surakarta. It balances the energy of a collaborative student tech community with the polished structure of a world-class educational technology platform. 

The aesthetic is Modern Corporate infused with Glass-Tech accents:
- **Hero & Core Canvases**: Rich, deep teal backdrops establish institutional credibility and technical focus.
- **Transitional Banners**: Sweeping sky blue modular containers with prominent rounded top corners physically anchor statistical milestones and highlights, lifting the content out of flat layout conventions.
- **Glassmorphic Floating Badges**: Subtle frosted indicators and pill callouts layer above visual hero photography to convey prestige, mentorship, and dynamic student achievements.
- **Atmosphere**: Confident, welcoming, intellectual, and community-driven.

## Colors

The color system structures hierarchy through deliberate contrast shifts between deep aquatic teals and airy sky tones:

- **Deep Teal (`#07536A`)**: Primary brand tone. Drives primary hero sections, deep accent cards, headers, footers, and active focus boundaries.
- **Sky Blue (`#A9D2F4`)**: Secondary accent. Used specifically for rounded stat highlight sheets, secondary structural containers, and light pill accents.
- **Dark Navy (`#17364F`)**: Grounding neutral. Used for ultra-high contrast body headlines, deep typography on white canvases, and structural dividers.
- **Cyan Accent (`#48D6E8`)**: Vivid technical accent. Used for interactive triggers, glowing indicator dots, small badge borders, and tech-forward tag highlights.
- **Soft Blue-Gray (`#F1F7FC`)**: Background foundation. Creates smooth alternations between stark white surfaces and section containers.
- **Pure White (`#FFFFFF`)**: Crisp foreground cards, standard surface plates, and button foregrounds on dark bands.

## Typography

The pairing of **Plus Jakarta Sans** and **Manrope** provides a geometric, warm, yet rigorously structured visual hierarchy. 

Headlines in Plus Jakarta Sans make use of tight negative letter-spacing (`-0.02em` to `-0.03em`) and heavy weights (Bold and ExtraBold) to deliver impact reminiscent of modern web portals. Body text in Manrope offers superior legibility at smaller sizes for program documentation, department overviews, and article summaries.

## Layout & Spacing

A 12-column responsive fluid grid powers the layout, capping at a maximum desktop width of `1280px` with centered alignment:

- **Desktop (1024px+)**: 12 columns with `1.5rem` gutters and `2rem` screen margins. Section paddings use `space-2xl` to `space-3xl` for vertical rhythm.
- **Tablet (768px - 1023px)**: 8 columns with `1rem` gutters and `1.5rem` margins. Two-column card lists collapse gracefully.
- **Mobile (< 768px)**: 4 columns with `1rem` gutters and `1.25rem` margins. Complex stat sections reflow into single-column or 2x2 grids.

A key signature of the layout is the **Arch Shelf Transition**: sections such as the metric highlights use inverted negative top margins combined with exaggerated top border-radii (`2.5rem` to `3rem`) to overlap preceding darker hero backgrounds seamlessly.

## Elevation & Depth

Visual depth is achieved through layered structural planes rather than heavy drop shadows:

1. **Frosted Glass Cards (Floating Hero Elements)**: Semi-transparent white (`rgba(255, 255, 255, 0.15)`) over deep teal backgrounds, backed by a `16px` backdrop-blur filter and an ultra-fine border (`1px solid rgba(255, 255, 255, 0.25)`).
2. **Surface Elevation (Cards on Soft Backgrounds)**: Clean white surfaces placed on `#F1F7FC` with an ambient diffused shadow: `0 10px 30px -5px rgba(23, 54, 79, 0.06)`.
3. **Pill Interactive Overlays**: Buttons and active filters feature light surface glows: `0 4px 14px rgba(7, 83, 106, 0.15)`.
4. **Outlines**: Structural borders are thin, subtle, and tinted with the base navy hue at `8%` to `12%` opacity (`rgba(23, 54, 79, 0.08)`).

## Shapes

The design system implements a rounded, approachable shape language (Pill-shaped level 3):

- **Buttons & Chips**: Pure pill shapes (`rounded-full` / `9999px`) provide friendly, modern touchpoints for calls-to-action.
- **Standard Cards**: Generously radiused corners at `1.25rem` to `1.5rem` (`20px` - `24px`).
- **Feature Banners & Section Shelves**: Distinctive top-corner curvatures reaching `2.5rem` to `3rem` (`40px` - `48px`), creating the recognizable scooped transition between the hero section and subsequent content sheets.

## Components

### Buttons
- **Primary Pill**: Pure white background (`#FFFFFF`) with deep teal typography (`#07536A`), full pill radius, and subtle hover rise with elevated shadow. When placed on light backgrounds, reverses to solid Deep Teal with white typography.
- **Ghost / Outline Pill**: Transparent fill, `1.5px` border in white (`#FFFFFF`) or Cyan (`#48D6E8`), text styled in matching color. Hover introduces `10%` fill tint.
- **Compact Action Pill**: Used within cards; `36px` height, `14px` semi-bold label, soft sky background with deep navy text.

### Stat Highlight Shelves
- Distinctive sky blue container (`#A9D2F4`) with massive rounded top corners (`40px`).
- Left column hosts high-impact section headlines in Dark Navy (`#17364F`), while right columns display large numeric metrics (`48px` Plus Jakarta Sans) paired with compact two-line descriptions.

### Floating Hero Badges
- Floating glassmorphic tags hovering around hero imagery.
- Features micro rating stars, rounded thumbnail icons, brief text descriptors, and hand-drawn indicator accents in Cyan (`#48D6E8`).

### Content & Division Cards
- **White Sheet Cards**: Pure white surface, `20px` border-radius, `1px solid rgba(23, 54, 79, 0.06)` outline, containing event schedules, divisions (BPH, Litbang, Kominfo, etc.), or study groups.
- **Hover Behavior**: Smooth vertical translate (`-4px`) and shadow deepening to `0 16px 32px -8px rgba(7, 83, 106, 0.12)`.

### Form Fields & Inputs
- Fully rounded pill input bars with soft background fills (`#F1F7FC` or semi-opaque white), inset padding (`16px 24px`), and a focused ring in Cyan (`#48D6E8`).