# Fast Glass Mirrors & More – Custom Shop System

## Overview
This is a custom-built business management system for a glass and manufacturing company.

This is NOT a generic quoting tool. It is a fully customized system that will evolve into a complete shop management platform.

## Core Goals
- Build insulated glass units (IGUs) with component-based pricing
- Generate Quotes → Work Orders → Invoices
- Track production, installation, and payments
- Replace existing systems like Glass Quotes / Smart Glazier with a better custom solution

## Current Phase
We are in EARLY DEVELOPMENT.

Currently building:
- Quote Builder (insulated unit pricing)
- Core pricing engine
- Basic UI in Next.js

## Business Rules (CRITICAL)
- Pricing is based on:
  - Lite 1 cost per sq ft
  - Lite 2 cost per sq ft
  - Spacer cost per sq ft
- Pricing categories:
  - Retail (default)
  - Contractor (-10%)
  - Apartment (-20%)

### Sizing Rules
- Users can enter fractional sizes (e.g. 30 1/4, 9 7/16)
- System converts to decimal internally
- Pricing rounds UP to next EVEN inch:
  - 19 → 20
  - 20 → 20
  - 20.5 → 22
- Minimum charge = 3 sq ft

### Spacer Sizes
- 1/4
- 5/16
- 3/8
- 7/16
- 1/2
- 5/8

### Glass Types (initial)
- Clear
- Low-E (ClimaGuard 70/36)

(More will be added later)

## Pattern Fees (Coming Soon)
- IGBPF = $37.00
- IGDPF = $138.75
- MDPF = $27.75
- MBPF = $21.83

- Must be editable/overridable

## Shapes (Coming Soon)
- Trapezoid Left / Right
- Right Triangle (Left / Right)
- Circle
- Semi-Ellipse
- Arch Top
- Octagon
- Racetrack

## Future Features
- Customer database
- Quote → Work Order → Invoice workflow
- Labor tracking by installer
- Tax reporting by county
- Scheduling system (like Google Calendar)
- Reporting dashboards
- Printable work orders & invoices

## Tech Stack
- Next.js
- TypeScript
- Prisma
- PostgreSQL

## Important Notes
- This system must match real shop workflow
- Simplicity first, then expand
- Everything must be editable later (pricing, products, fees)