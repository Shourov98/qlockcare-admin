---
name: Clinical Precision
colors:
  surface: '#f7faf8'
  surface-dim: '#d7dbd9'
  surface-bright: '#f7faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f2'
  surface-container: '#ebefec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e0e3e1'
  on-surface: '#181c1b'
  on-surface-variant: '#3e4946'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef1ef'
  outline: '#6e7976'
  outline-variant: '#bec9c5'
  surface-tint: '#066a5f'
  primary: '#004e45'
  on-primary: '#ffffff'
  primary-container: '#00685d'
  on-primary-container: '#93e4d6'
  inverse-primary: '#85d5c7'
  secondary: '#29685e'
  on-secondary: '#ffffff'
  secondary-container: '#afefe2'
  on-secondary-container: '#306e64'
  tertiary: '#384746'
  on-tertiary: '#ffffff'
  tertiary-container: '#505f5e'
  on-tertiary-container: '#c8d8d7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a1f2e3'
  primary-fixed-dim: '#85d5c7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#afefe2'
  secondary-fixed-dim: '#94d2c6'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#065047'
  tertiary-fixed: '#d5e6e4'
  tertiary-fixed-dim: '#b9cac8'
  on-tertiary-fixed: '#0f1e1d'
  on-tertiary-fixed-variant: '#3a4a49'
  background: '#f7faf8'
  on-background: '#181c1b'
  surface-variant: '#e0e3e1'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  layout_split: 50%
---

## Brand & Style

The brand personality is rooted in reliability, efficiency, and clinical excellence. It targets healthcare professionals and patients who require a frictionless, high-trust environment for managing medical care. The visual direction follows a **Corporate / Modern** aesthetic, emphasizing clarity and structural integrity over decorative flair.

This design system utilizes a "High-Trust Minimalism" approach. It balances the sterile precision of medical software with a modern warmth through the use of soft teal accents and rounded corners. The interface should feel calm and organized, reducing cognitive load for users performing critical tasks.

## Colors

The palette is anchored by a deep Primary Teal, conveying authority and a contemporary healthcare feel. The use of a Primary Dark variant ensures high contrast for navigation elements, while Primary Light provides a gentle background for highlights and selected states.

Functional status colors are strictly reserved for feedback. The Neutral set provides the structural scaffolding, using a subtle green-tinted background (#f5fbf8) to differentiate from the pure white Surface containers where data and inputs reside.

## Typography

The design system exclusively utilizes **Inter** to maintain a systematic, utilitarian appearance that prioritizes legibility. Headlines use a tighter letter spacing and semi-bold weights to create a strong visual hierarchy. Body text is optimized for readability with a generous line height, ensuring that medical information is easily digestible. Label styles are used for secondary metadata or small UI cues, often employing uppercase tracking for distinction.

## Layout & Spacing

The layout philosophy follows a rigid 50/50 split on desktop views. 
- **The Interaction Zone (Left):** Resides on a pure White (#ffffff) background with a standard 32px (lg) padding. This area is dedicated to forms, authentication, and primary actions.
- **The Brand Zone (Right):** Utilizes a deep gradient from Primary Dark (#004d44) to a lighter teal (#008376). This side contains an animated slideshow designed to evoke emotional resonance.

On mobile devices, the Brand Zone is suppressed, allowing the Interaction Zone to occupy 100% of the viewport width. Internal spacing follows an 8-pixel rhythm to ensure consistent alignment across all components.

## Elevation & Depth

This design system uses a combination of **Tonal Layers** and **Ambient Shadows** to communicate hierarchy.
- **Surface Elevation:** The primary background uses the Background (#f5fbf8) color. Active cards and interactive modules sit on Surface White (#ffffff).
- **Shadow Profile:** Interactive cards utilize a very soft, diffused shadow: `0px 1px 4px rgba(0,0,0,0.08)`. This creates a subtle lift without feeling heavy.
- **Borders:** Low-contrast outlines using the Border color (#bcc9c5) are preferred for defining input boundaries and secondary container edges, ensuring the UI remains clean and flat.

## Shapes

The shape language is "Softly Geometric." A standard 12px radius is applied to cards and input fields to provide a modern, approachable feel while maintaining professional structure. Buttons depart from this standard with a more pronounced 20px radius, moving toward a pill-shape to make them stand out as the primary interactive elements. This variation in corner treatment helps the user subconsciously distinguish between static containers and clickable actions.

## Components

### Buttons
Primary buttons use the Primary Teal background with white text and a 20px border radius. Hover states should transition to Primary Dark. Secondary buttons use a transparent background with a Primary Teal border and text.

### Inputs
Inputs use a 12px border radius and the Surface White background. The border color is #bcc9c5. When focused, the border should transition to Primary Teal with a subtle 2px glow. Placeholder text should use the Text Light color.

### Cards
Cards are the primary container for grouping information. They must use Surface White (#ffffff), a 12px border radius, and the designated 0px 1px 4px rgba(0,0,0,0.08) shadow. Use 24px internal padding for content.

### Status Indicators
Chips or badges for status (Error, Warning, Success) should use a subtle background tint (10% opacity of the status color) with high-contrast text in the full-weight status color. These should have a 100px border radius for a pill-shaped appearance.

### Lists
Lists should be separated by a 1px border (#bcc9c5) rather than shadows to maintain a clean, professional table-like appearance. Vertical spacing between list items should be at least 16px (sm).