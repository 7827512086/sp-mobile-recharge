# Design Brief — SP Mobile Recharge App

## Direction
SP Mobile Recharge App — Premium dark fintech for Indian digital services (recharge, bills, transfers, deposits). Teal + gold on charcoal, Space Grotesk + Plus Jakarta Sans, elevated card hierarchy.

## Tone
Confident clarity without coldness. Warm, trustworthy, transaction-ready. Dark signals premium; teal = action, gold = success.

## Differentiation
Teal + gold fintech scheme with zone separation for money transfer, bills, deposits.

## Color Palette
| Token       | OKLCH            | Role                           |
| ----------- | ---------------- | ------------------------------ |
| background  | 0.13 0.018 260   | Deep charcoal, main surface    |
| card        | 0.17 0.022 260   | Elevated surfaces              |
| primary     | 0.68 0.18 190    | Teal — action, transfers       |
| accent      | 0.75 0.16 75     | Gold — success                 |
| destructive | 0.55 0.22 25     | Red — cancellation             |

## Typography
Display: Space Grotesk (headers). Body: Plus Jakarta Sans (text). Mono: JetBrains Mono (amounts/IDs). Scale: hero `text-3xl`, section `text-2xl`, body `text-base`.

## Structural Zones
| Zone              | Background    | Pattern                       |
| ----------------- | ------------- | ----------------------------- |
| Header/NavBar     | bg-card       | Logo, branding, user menu     |
| Primary Section   | bg-background | Content area                  |
| Card/Plan/Report  | bg-card       | Elevated, shadow-card         |
| Secondary Surface | bg-muted/10   | Filters, settings             |
| Admin Nav         | bg-sidebar    | Actions, pagination           |

## Page Patterns
**Money Transfer:** Input (border-primary-subtle), confirm (teal button), multi-step checkmarks.
**Bill Payment:** Category icons (3rem, hover -2px), status-badges color-coded.
**Digital Deposits:** 4-col grid (preset cards, border-accent-subtle), progress-bar gradient, interest badge.
**Admin Reports:** Filter bar, striped table (muted/5), status-badges, export button.
**Admin Settings:** Slider (teal track), toggles (muted/primary), inputs, save (disabled until change).

## Components
Buttons: teal primary, muted secondary, shadow hover. Cards: border, shadow-card, hover:elevated. Badges: muted or accent. Inputs: bg-muted, focus:ring-primary-soft.

## Motion
Fade-in 300ms. Card: shadow + scale 1.01. Icons: translateY -2px + border. Progress: 600ms ease-out. Toggles: 200ms.

## Constraints
No defaults, gradients (except progress), glassmorphism. Mobile-first 375px+. Dark only. Monospace for numeric data.

## Signature
1. Wallet: teal border-glow
2. Amounts: JetBrains Mono clarity
3. Icons: hover motion signals interactivity
4. Badges: color-coded instant scan
5. Deposits: accent badge conveys premium
